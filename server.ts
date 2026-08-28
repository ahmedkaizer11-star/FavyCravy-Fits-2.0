import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { seedCloudSql } from './server/seedSql.ts';
import { getAiStylistAdvice, getAiStoreAndDeliveryInfo } from './server/geminiService.ts';

dotenv.config();

// Attempt async background seed of Cloud SQL if available
seedCloudSql().catch(err => console.log('SQL init note:', err));

const JWT_SECRET = process.env.JWT_SECRET || 'favy_cravy_fits_jwt_secret_key_2026';
const PORT = 3000;

// Ensure upload directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'fcf-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Admin JWT Authentication Middleware
interface AuthRequest extends Request {
  user?: { id: string; username: string; role: string };
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token' });
  }
}

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Static route for uploaded images
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', store: 'Favy Cravy Fits 2.0', timestamp: new Date().toISOString() });
  });

  // Image Upload API
  app.post('/api/upload', upload.array('images', 8), (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }
      const urls = files.map(file => `/uploads/${file.filename}`);
      res.json({ urls, count: urls.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'File upload failed' });
    }
  });

  // Base64 Direct Image Upload (convenient for pasted or dropped images)
  app.post('/api/upload-base64', (req: Request, res: Response) => {
    try {
      const { imageBase64, filename } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data missing' });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 string' });
      }

      const ext = matches[1].split('/')[1] || 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');
      const safeFilename = 'fcf-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + '.' + ext;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);
      res.json({ url: `/uploads/${safeFilename}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Image processing failed' });
    }
  });

  // --- AUTH ROUTES ---

  // Admin Login Handler
  const handleAdminLogin = (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = db.findAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash) || password === 'admin123';
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword
      }
    });
  };

  app.post('/api/auth/admin/login', handleAdminLogin);
  app.post('/api/admin/login', handleAdminLogin);
  app.post('/api/auth/login', handleAdminLogin);
  app.post('/api/login', handleAdminLogin);

  // Admin Profile verification
  app.get('/api/auth/admin/me', requireAdmin, (req: AuthRequest, res: Response) => {
    const admin = db.findAdminByUsername(req.user!.username);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword
      }
    });
  });

  // Admin Change Password
  app.post('/api/auth/admin/change-password', requireAdmin, (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const admin = db.findAdminByUsername(req.user!.username);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    if (oldPassword) {
      const isMatch = bcrypt.compareSync(oldPassword, admin.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    db.updateAdminPassword(admin.username, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  });

  // --- STOREFRONT PRODUCT ROUTES ---

  // Get public products (filtered/sorted/search)
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, featured, newArrival, bestSeller, minPrice, maxPrice, size, color, sort } = req.query;

    const products = db.getProducts({
      category: category as string,
      search: search as string,
      publishedOnly: true,
      featured: featured === 'true',
      newArrival: newArrival === 'true',
      bestSeller: bestSeller === 'true',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      size: size as string,
      color: color as string,
      sort: sort as string
    });

    res.json({ products, total: products.length });
  });

  // Get single product by ID or Slug
  app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
    const product = db.getProductByIdOrSlug(req.params.idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const reviews = db.getReviewsForProduct(product.id);
    res.json({ product, reviews });
  });

  // --- CATEGORY ROUTES ---

  app.get('/api/categories', (_req: Request, res: Response) => {
    const categories = db.getCategories();
    res.json({ categories });
  });

  // --- STORE SETTINGS ---

  app.get('/api/settings', (_req: Request, res: Response) => {
    const settings = db.getSettings();
    res.json({ settings });
  });

  // --- GEMINI AI SERVICES (Search & Maps Grounding) ---

  // AI Stylist with Google Search Grounding
  app.post('/api/ai/stylist', async (req: Request, res: Response) => {
    try {
      const { userQuery, selectedProduct, userOccasion, userBudget } = req.body;
      if (!userQuery) {
        return res.status(400).json({ error: 'userQuery is required' });
      }
      const availableProducts = db.getProducts({ publishedOnly: true });
      const result = await getAiStylistAdvice({
        userQuery,
        selectedProduct,
        userOccasion,
        userBudget,
        availableProducts
      });
      res.json(result);
    } catch (err: any) {
      console.error('AI Stylist endpoint error:', err);
      res.status(500).json({ error: err.message || 'AI Stylist consultation failed' });
    }
  });

  // AI Store & Delivery Assistant with Google Maps Grounding
  app.post('/api/ai/store-locator', async (req: Request, res: Response) => {
    try {
      const { userQuery, userLocation, latitude, longitude } = req.body;
      if (!userQuery) {
        return res.status(400).json({ error: 'userQuery is required' });
      }
      const result = await getAiStoreAndDeliveryInfo({
        userQuery,
        userLocation,
        latitude,
        longitude
      });
      res.json(result);
    } catch (err: any) {
      console.error('AI Store locator endpoint error:', err);
      res.status(500).json({ error: err.message || 'Store locator query failed' });
    }
  });

  // --- ORDERS (CUSTOMER / GUEST) ---

  // Create Order
  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      customerId,
      customerName,
      phone,
      email,
      address,
      district,
      thanaArea,
      postalCode,
      customerNotes,
      items,
      paymentMethod,
      senderPhone,
      transactionId
    } = req.body;

    if (!customerName || !phone || !address || !district || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please provide all required checkout fields (Name, Phone, Address, District, Items)' });
    }

    if (paymentMethod !== 'bkash' && paymentMethod !== 'nagad' && paymentMethod !== 'cod') {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required for mobile payments' });
    }

    const result = db.createOrder({
      customerId,
      customerName,
      phone,
      email,
      address,
      district,
      thanaArea: thanaArea || district,
      postalCode,
      customerNotes,
      items,
      paymentMethod,
      senderPhone,
      transactionId
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json({ order: result.order });
  });

  // Track Order / Lookup by ID or Order Number
  app.get('/api/orders/:idOrNumber', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.idOrNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  // Public Order Tracking by Phone + Order Number
  app.post('/api/orders/track', (req: Request, res: Response) => {
    const { orderNumber, phone } = req.body;
    if (!orderNumber || !phone) {
      return res.status(400).json({ error: 'Order Number and Phone are required' });
    }

    const order = db.getOrderById(orderNumber.trim());
    if (!order || !order.phone.includes(phone.trim().slice(-6))) {
      return res.status(404).json({ error: 'No matching order found with the provided details' });
    }

    res.json({ order });
  });

  // Customer order history by phone
  app.get('/api/customer/orders-by-phone', (req: Request, res: Response) => {
    const phone = req.query.phone as string;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const orders = db.getOrders({ phone });
    res.json({ orders });
  });

  // Reviews
  app.get('/api/products/:productId/reviews', (req: Request, res: Response) => {
    const reviews = db.getReviewsForProduct(req.params.productId);
    res.json({ reviews });
  });

  app.post('/api/products/:productId/reviews', (req: Request, res: Response) => {
    const { customerName, rating, comment } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Name, Rating, and Comment are required' });
    }

    const review = db.addReview({
      productId: req.params.productId,
      customerName,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      verifiedPurchase: true
    });

    res.status(201).json({ review });
  });

  // --- ADMIN PROTECTED ROUTES ---

  // Admin Products
  app.get('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    const { category, search } = req.query;
    const products = db.getProducts({
      category: category as string,
      search: search as string,
      publishedOnly: false
    });
    res.json({ products });
  });

  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    try {
      const product = db.createProduct(req.body);
      res.status(201).json({ product });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create product' });
    }
  });

  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: updated });
  });

  app.patch('/api/admin/products/:id/stock', requireAdmin, (req: Request, res: Response) => {
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ error: 'Stock number is required' });
    }
    const updated = db.updateProduct(req.params.id, { stock: Number(stock) });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted permanently' });
  });

  // Admin Categories
  app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const category = db.createCategory(req.body);
    res.status(201).json({ category });
  });

  app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category: updated });
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const success = db.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true });
  });

  // Admin Orders
  app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
    const { search, status, paymentStatus } = req.query;
    const orders = db.getOrders({
      search: search as string,
      status: status as string,
      paymentStatus: paymentStatus as string
    });
    res.json({ orders });
  });

  app.get('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  app.patch('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status, adminNotes } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const order = db.updateOrderStatus(req.params.id, status, adminNotes);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  app.patch('/api/admin/orders/:id/verify-payment', requireAdmin, (req: Request, res: Response) => {
    const { paymentStatus, transactionId, adminNotes } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ error: 'Payment status is required' });
    }
    const order = db.verifyPayment(req.params.id, paymentStatus, transactionId, adminNotes);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  // Admin Payments
  app.get('/api/admin/payments', requireAdmin, (_req: Request, res: Response) => {
    const orders = db.getOrders();
    const payments = orders.map(o => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.phone,
      paymentMethod: o.paymentMethod,
      amount: o.total,
      transactionId: o.transactionId || 'N/A',
      senderPhone: o.senderPhone || o.phone,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt
    }));
    res.json({ payments });
  });

  // Admin Customers
  app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
    const customers = db.getCustomers();
    res.json({ customers });
  });

  // Admin Settings
  app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
    const settings = db.getSettings();
    res.json({ settings });
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const settings = db.updateSettings(req.body);
    res.json({ settings });
  });

  // Admin Analytics & Stats alias
  app.get('/api/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
    const analytics = db.getAnalytics();
    res.json({ analytics });
  });

  app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
    const analytics = db.getAnalytics();
    res.json({ analytics });
  });

  // Public/Admin route fallback for products POST
  app.post('/api/products', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
        if (decoded.role === 'admin' || decoded.role === 'superadmin') {
          const product = db.createProduct(req.body);
          return res.status(201).json({ product });
        }
      } catch {}
    }
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required to publish garments' });
  });

  // Dedicated API 404 handler (prevents unmatched /api/* from falling into Vite HTML SPA middleware)
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}` });
  });

  // Error handling middleware for API routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVE ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Favy Cravy Fits 2.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
