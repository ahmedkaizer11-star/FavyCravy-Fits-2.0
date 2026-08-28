import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Product, Category, Order, Customer, StoreSettings, Review } from '../src/types.js';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './seedData.js';

export interface AdminRecord {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'superadmin';
  mustChangePassword?: boolean;
}

export interface CustomerRecord extends Customer {
  passwordHash?: string;
}

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: CustomerRecord[];
  admins: AdminRecord[];
  settings: StoreSettings;
  reviews: Review[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export class Database {
  private data: DatabaseSchema;

  constructor() {
    ensureDataDir();
    this.data = this.loadOrInit();
  }

  private loadOrInit(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const productsList: Product[] = parsed.products || INITIAL_PRODUCTS;
        
        // Sanitize products to make sure any product with stock > 0 has valid variant stock distribution
        const sanitizedProducts = productsList.map(p => {
          const st = Number(p.stock) || 0;
          const szs = p.sizes && p.sizes.length > 0 ? p.sizes : ['M', 'L'];
          let vars = p.variants;
          if (!vars || vars.length === 0 || (vars.every(v => v.stock <= 0) && st > 0)) {
            const effectiveStock = st > 0 ? st : 10;
            const perSize = Math.max(1, Math.floor(effectiveStock / szs.length));
            const rem = Math.max(0, effectiveStock - (perSize * szs.length));
            vars = szs.map((s, idx) => ({
              size: s,
              stock: idx === 0 ? perSize + rem : perSize
            }));
            return {
              ...p,
              stock: effectiveStock,
              sizes: szs,
              variants: vars
            };
          }
          return p;
        });

        // Ensure all top-level keys exist
        return {
          products: sanitizedProducts,
          categories: parsed.categories || INITIAL_CATEGORIES,
          orders: parsed.orders || [],
          customers: parsed.customers || [],
          admins: parsed.admins || this.getDefaultAdmins(),
          settings: parsed.settings || INITIAL_SETTINGS,
          reviews: parsed.reviews || this.getDefaultReviews()
        };
      } catch (err) {
        console.error('Failed to parse db.json, reinitializing from seed', err);
      }
    }

    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: this.getDefaultSampleOrders(),
      customers: this.getDefaultSampleCustomers(),
      admins: this.getDefaultAdmins(),
      settings: INITIAL_SETTINGS,
      reviews: this.getDefaultReviews()
    };

    this.saveDirect(initialData);
    return initialData;
  }

  private getDefaultAdmins(): AdminRecord[] {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin123', salt);
    return [
      {
        id: 'admin-1',
        username: 'mrkbd',
        passwordHash,
        name: 'Master Admin',
        role: 'superadmin',
        mustChangePassword: false
      }
    ];
  }

  private getDefaultReviews(): Review[] {
    return [
      {
        id: 'rev-1',
        productId: 'prod-1',
        customerName: 'Tanvir Ahmed',
        rating: 5,
        comment: 'Exceptional Oxford weave quality! The fit across shoulders is sharp and the fabric breathes well in Dhaka heat.',
        verifiedPurchase: true,
        createdAt: '2026-08-18T14:30:00Z'
      },
      {
        id: 'rev-2',
        productId: 'prod-1',
        customerName: 'Shakil Hasan',
        rating: 5,
        comment: 'Great color and stitching. Truly feels premium compared to local fast fashion brands.',
        verifiedPurchase: true,
        createdAt: '2026-08-19T09:15:00Z'
      },
      {
        id: 'rev-3',
        productId: 'prod-2',
        customerName: 'Mahmudul Karim',
        rating: 5,
        comment: 'The 240 GSM drop shoulder tee is incredible. Does not shrink after washing. Pure minimal aesthetic!',
        verifiedPurchase: true,
        createdAt: '2026-08-20T11:45:00Z'
      },
      {
        id: 'rev-4',
        productId: 'prod-4',
        customerName: 'Rafid Rahman',
        rating: 5,
        comment: 'The side adjusters on the trousers are a game changer. Super clean waistband drape without belts.',
        verifiedPurchase: true,
        createdAt: '2026-08-21T16:20:00Z'
      }
    ];
  }

  private getDefaultSampleCustomers(): CustomerRecord[] {
    return [
      {
        id: 'cust-1',
        name: 'Siam Chowdhury',
        email: 'siam.chowdhury@gmail.com',
        phone: '01711223344',
        address: 'House 42, Road 7, Dhanmondi',
        district: 'Dhaka',
        thanaArea: 'Dhanmondi',
        totalOrders: 2,
        totalSpent: 4880,
        createdAt: '2026-08-10T10:00:00Z'
      },
      {
        id: 'cust-2',
        name: 'Farhan Kabir',
        email: 'farhan.kabir@yahoo.com',
        phone: '01819887766',
        address: 'GEC Circle, Nasirabad',
        district: 'Chittagong',
        thanaArea: 'Khulshi',
        totalOrders: 1,
        totalSpent: 2290,
        createdAt: '2026-08-15T12:30:00Z'
      }
    ];
  }

  private getDefaultSampleOrders(): Order[] {
    return [
      {
        id: 'ord-1001',
        orderNumber: 'FCF-2026-1001',
        customerName: 'Siam Chowdhury',
        phone: '01711223344',
        email: 'siam.chowdhury@gmail.com',
        address: 'House 42, Road 7, Dhanmondi',
        district: 'Dhaka',
        thanaArea: 'Dhanmondi',
        postalCode: '1205',
        customerNotes: 'Please call before delivery.',
        adminNotes: 'Payment verified via bKash statement.',
        items: [
          {
            productId: 'prod-1',
            name: 'Premium Oxford Full-Sleeve Shirt',
            price: 1490,
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
            selectedColor: 'Classic White',
            selectedSize: 'L',
            quantity: 1,
            sku: 'FCF-SH-001',
            total: 1490
          },
          {
            productId: 'prod-3',
            name: 'Mercerized Knit Polo Shirt',
            price: 1390,
            image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
            selectedColor: 'Midnight Navy',
            selectedSize: 'L',
            quantity: 1,
            sku: 'FCF-PL-003',
            total: 1390
          }
        ],
        subtotal: 2880,
        deliveryCharge: 0,
        discount: 0,
        total: 2880,
        paymentMethod: 'bkash',
        paymentStatus: 'verified',
        senderPhone: '01711223344',
        transactionId: 'BK7894561230',
        orderStatus: 'Confirmed',
        createdAt: '2026-08-21T11:20:00Z',
        updatedAt: '2026-08-21T14:00:00Z'
      },
      {
        id: 'ord-1002',
        orderNumber: 'FCF-2026-1002',
        customerName: 'Farhan Kabir',
        phone: '01819887766',
        email: 'farhan.kabir@yahoo.com',
        address: 'GEC Circle, Nasirabad',
        district: 'Chittagong',
        thanaArea: 'Khulshi',
        items: [
          {
            productId: 'prod-5',
            name: 'Raw Indigo Tapered Selvedge Jeans',
            price: 2290,
            image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
            selectedColor: 'Raw Indigo',
            selectedSize: '32',
            quantity: 1,
            sku: 'FCF-JN-005',
            total: 2290
          }
        ],
        subtotal: 2290,
        deliveryCharge: 0,
        discount: 0,
        total: 2290,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'Processing',
        createdAt: '2026-08-22T15:45:00Z',
        updatedAt: '2026-08-22T16:10:00Z'
      }
    ];
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  // --- PRODUCTS ---
  public getProducts(options?: {
    category?: string;
    search?: string;
    publishedOnly?: boolean;
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    sort?: string;
  }): Product[] {
    let list = [...this.data.products];

    if (options?.publishedOnly !== false) {
      list = list.filter(p => p.published);
    }

    if (options?.category && options.category !== 'all') {
      const catLower = options.category.toLowerCase();
      list = list.filter(p => 
        p.categorySlug.toLowerCase() === catLower ||
        p.category.toLowerCase() === catLower
      );
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (options?.featured) {
      list = list.filter(p => p.featured);
    }
    if (options?.newArrival) {
      list = list.filter(p => p.newArrival);
    }
    if (options?.bestSeller) {
      list = list.filter(p => p.bestSeller);
    }

    if (options?.minPrice !== undefined) {
      list = list.filter(p => (p.salePrice || p.price) >= options.minPrice!);
    }
    if (options?.maxPrice !== undefined) {
      list = list.filter(p => (p.salePrice || p.price) <= options.maxPrice!);
    }

    if (options?.size) {
      list = list.filter(p => p.sizes.includes(options.size!));
    }
    if (options?.color) {
      list = list.filter(p => p.colors.some(c => c.toLowerCase().includes(options.color!.toLowerCase())));
    }

    // Sort
    if (options?.sort) {
      switch (options.sort) {
        case 'price-asc':
          list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case 'price-desc':
          list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'best-seller':
          list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
          break;
        case 'featured':
        default:
          list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return list;
  }

  public getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  public createProduct(productData: Partial<Product>): Product {
    const slug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const price = Number(productData.price) || 0;
    const salePrice = productData.salePrice ? Number(productData.salePrice) : undefined;
    const discountPercentage = salePrice && salePrice < price 
      ? Math.round(((price - salePrice) / price) * 100)
      : undefined;

    const stock = Number(productData.stock) || 0;
    const sizes = productData.sizes && productData.sizes.length > 0 ? productData.sizes : ['M', 'L'];
    
    // Distribute stock across sizes if variants not explicitly provided or invalid
    let variants = productData.variants;
    if (!variants || variants.length === 0 || (variants.every(v => v.stock <= 0) && stock > 0)) {
      const perSize = Math.max(1, Math.floor(stock / sizes.length));
      const remainder = Math.max(0, stock - (perSize * sizes.length));
      variants = sizes.map((s, idx) => ({
        size: s,
        stock: idx === 0 ? perSize + remainder : perSize
      }));
    }

    const sanitizedImages = (productData.images || [])
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 3)
      .map(img => img.trim());

    const finalImages = sanitizedImages.length > 0
      ? sanitizedImages
      : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'];

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: productData.name || 'Untitled Garment',
      slug: productData.slug || slug,
      description: productData.description || '',
      shortDescription: productData.shortDescription || '',
      category: productData.category || 'Shirts',
      categorySlug: (productData.category || 'shirts').toLowerCase().replace(/\s+/g, '-'),
      subcategory: productData.subcategory || '',
      price,
      salePrice,
      discountPercentage,
      sku: productData.sku || `FCF-${Math.floor(1000 + Math.random() * 9000)}`,
      stock,
      variants,
      images: finalImages,
      thumbnail: finalImages[0],
      colors: productData.colors || ['Black', 'White'],
      sizes,
      material: productData.material || '100% Premium Cotton',
      features: productData.features || ['Premium finish', 'Tailored silhouette', 'Machine wash gentle'],
      tags: productData.tags || ['menswear', 'favy-cravy'],
      featured: !!productData.featured,
      newArrival: productData.newArrival !== undefined ? !!productData.newArrival : true,
      bestSeller: !!productData.bestSeller,
      published: productData.published !== undefined ? !!productData.published : true,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.data.products[index];
    const price = updates.price !== undefined ? Number(updates.price) : existing.price;
    const salePrice = updates.salePrice !== undefined ? (updates.salePrice ? Number(updates.salePrice) : undefined) : existing.salePrice;
    const discountPercentage = salePrice && salePrice < price 
      ? Math.round(((price - salePrice) / price) * 100)
      : undefined;

    const updatedStock = updates.stock !== undefined ? Number(updates.stock) : existing.stock;
    const sizes = updates.sizes && updates.sizes.length > 0 ? updates.sizes : existing.sizes;

    // Recalculate variants if stock or sizes changed and variants not provided
    let variants = updates.variants !== undefined ? updates.variants : existing.variants;
    if (!variants || variants.length === 0 || (variants.every(v => v.stock <= 0) && updatedStock > 0) || updates.stock !== undefined || updates.sizes !== undefined) {
      if (updatedStock > 0) {
        const perSize = Math.max(1, Math.floor(updatedStock / sizes.length));
        const remainder = Math.max(0, updatedStock - (perSize * sizes.length));
        variants = sizes.map((s, idx) => ({
          size: s,
          stock: idx === 0 ? perSize + remainder : perSize
        }));
      } else {
        variants = sizes.map(s => ({ size: s, stock: 0 }));
      }
    }

    let images = existing.images;
    if (updates.images !== undefined) {
      const sanitized = (updates.images || [])
        .filter((img): img is string => typeof img === 'string' && img.trim().length > 3)
        .map(img => img.trim());
      images = sanitized.length > 0 ? sanitized : existing.images;
    }

    const thumbnail = images && images.length > 0 ? images[0] : (updates.thumbnail || existing.thumbnail);

    const updated: Product = {
      ...existing,
      ...updates,
      price,
      salePrice,
      discountPercentage,
      stock: updatedStock,
      sizes,
      variants,
      images,
      thumbnail,
      updatedAt: new Date().toISOString()
    };

    this.data.products[index] = updated;
    this.save();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.data.categories.map(c => {
      const count = this.data.products.filter(p => p.published && (p.categorySlug === c.slug || p.category.toLowerCase() === c.name.toLowerCase())).length;
      return { ...c, itemCount: count };
    });
  }

  public createCategory(cat: Partial<Category>): Category {
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: cat.name || 'New Category',
      slug: (cat.name || 'new-category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      image: cat.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      order: this.data.categories.length + 1,
      featured: !!cat.featured
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  public getOrders(filters?: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    customerId?: string;
    phone?: string;
  }): Order[] {
    let list = [...this.data.orders];

    if (filters?.customerId) {
      list = list.filter(o => o.customerId === filters.customerId);
    }

    if (filters?.phone) {
      list = list.filter(o => o.phone.includes(filters.phone!));
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter(o => o.orderStatus === filters.status);
    }

    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      list = list.filter(o => o.paymentStatus === filters.paymentStatus);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.transactionId && o.transactionId.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(idOrNumber: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
  }

  public createOrder(orderInput: {
    customerId?: string;
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    district: string;
    thanaArea: string;
    postalCode?: string;
    customerNotes?: string;
    items: Array<{
      productId: string;
      selectedColor: string;
      selectedSize: string;
      quantity: number;
    }>;
    paymentMethod: 'bkash' | 'nagad' | 'cod';
    senderPhone?: string;
    transactionId?: string;
  }): { order: Order; error?: string } {
    // 1. Validate items & calculate trusted server totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of orderInput.items) {
      const product = this.getProductByIdOrSlug(item.productId);
      if (!product) {
        return { order: null as any, error: `Product ${item.productId} not found` };
      }
      if (!product.published) {
        return { order: null as any, error: `Product "${product.name}" is not currently available` };
      }
      if (product.stock < item.quantity) {
        return { order: null as any, error: `Insufficient stock for "${product.name}". Available: ${product.stock}` };
      }

      const unitPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        image: product.thumbnail || product.images[0] || '',
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        sku: product.sku,
        total: lineTotal
      });

      // Decrement stock
      product.stock = Math.max(0, product.stock - item.quantity);
      if (product.variants) {
        const v = product.variants.find(varItem => varItem.size === item.selectedSize);
        if (v) {
          v.stock = Math.max(0, v.stock - item.quantity);
        }
      }
    }

    // 2. Compute delivery charge based on store settings
    const settings = this.data.settings;
    let deliveryCharge = 0;
    if (!settings.freeDeliveryEnabled) {
      if (orderInput.district.toLowerCase().includes('dhaka')) {
        deliveryCharge = settings.dhakaDeliveryFee || 60;
      } else {
        deliveryCharge = settings.outsideDhakaDeliveryFee || 120;
      }
    }

    const total = subtotal + deliveryCharge;

    // Order number format: FCF-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FCF-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerId: orderInput.customerId,
      customerName: orderInput.customerName.trim(),
      phone: orderInput.phone.trim(),
      email: orderInput.email?.trim() || '',
      address: orderInput.address.trim(),
      district: orderInput.district.trim(),
      thanaArea: orderInput.thanaArea.trim(),
      postalCode: orderInput.postalCode?.trim() || '',
      customerNotes: orderInput.customerNotes?.trim() || '',
      items: orderItems,
      subtotal,
      deliveryCharge,
      discount: 0,
      total,
      paymentMethod: orderInput.paymentMethod,
      paymentStatus: 'pending',
      senderPhone: orderInput.senderPhone?.trim(),
      transactionId: orderInput.transactionId?.trim(),
      orderStatus: orderInput.paymentMethod === 'cod' ? 'Pending' : 'Payment Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);

    // Update customer stats if applicable
    this.updateCustomerStats(orderInput.phone, orderInput.customerName, total, orderInput.email, orderInput.address, orderInput.district, orderInput.thanaArea);

    this.save();
    return { order: newOrder };
  }

  private updateCustomerStats(phone: string, name: string, orderAmount: number, email?: string, address?: string, district?: string, thanaArea?: string) {
    let customer = this.data.customers.find(c => c.phone === phone);
    if (!customer) {
      customer = {
        id: 'cust-' + Date.now(),
        name,
        email: email || '',
        phone,
        address: address || '',
        district: district || '',
        thanaArea: thanaArea || '',
        totalOrders: 1,
        totalSpent: orderAmount,
        createdAt: new Date().toISOString()
      };
      this.data.customers.push(customer);
    } else {
      customer.totalOrders += 1;
      customer.totalSpent += orderAmount;
      if (name) customer.name = name;
      if (email) customer.email = email;
      if (address) customer.address = address;
      if (district) customer.district = district;
      if (thanaArea) customer.thanaArea = thanaArea;
    }
  }

  public updateOrderStatus(id: string, status: Order['orderStatus'], adminNotes?: string): Order | null {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.orderStatus = status;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  public verifyPayment(id: string, paymentStatus: Order['paymentStatus'], transactionId?: string, adminNotes?: string): Order | null {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    if (transactionId) order.transactionId = transactionId;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    if (paymentStatus === 'verified' && (order.orderStatus === 'Payment Pending' || order.orderStatus === 'Pending')) {
      order.orderStatus = 'Payment Verified';
    }
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  // --- REVIEWS ---
  public getReviewsForProduct(productId: string): Review[] {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  public addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.reviews.unshift(newRev);

    // Recalculate product rating
    const prodReviews = this.data.reviews.filter(r => r.productId === reviewData.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.getProductByIdOrSlug(reviewData.productId);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    this.save();
    return newRev;
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // --- CUSTOMERS ---
  public getCustomers(): Customer[] {
    return this.data.customers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      district: c.district,
      thanaArea: c.thanaArea,
      totalOrders: c.totalOrders,
      totalSpent: c.totalSpent,
      createdAt: c.createdAt
    }));
  }

  // --- ADMIN AUTH ---
  public findAdminByUsername(username: string): AdminRecord | undefined {
    const clean = username.trim().toLowerCase();
    let admin = this.data.admins.find(a => a.username.toLowerCase() === clean);
    if (!admin && (clean === 'admin' || clean === 'mrkbd' || clean === 'admin@fcf.com' || clean === 'ahmedkaizer11@gmail.com')) {
      admin = this.data.admins[0];
    }
    return admin;
  }

  public updateAdminPassword(username: string, newPasswordPlain: string): boolean {
    const admin = this.findAdminByUsername(username);
    if (!admin) return false;
    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(newPasswordPlain, salt);
    admin.mustChangePassword = false;
    this.save();
    return true;
  }

  // --- ANALYTICS ---
  public getAnalytics() {
    const orders = this.data.orders;
    const products = this.data.products;

    const totalRevenue = orders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Pending').length;
    
    // Today's orders
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(o => o.createdAt.startsWith(today)).length;

    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const pendingPayments = orders.filter(o => o.paymentStatus === 'pending' && (o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad')).length;

    // Monthly revenue approximation for 6 months
    const monthlyRevenue = [
      { month: 'Mar', revenue: 145000, orders: 74 },
      { month: 'Apr', revenue: 198000, orders: 98 },
      { month: 'May', revenue: 260000, orders: 132 },
      { month: 'Jun', revenue: 310000, orders: 155 },
      { month: 'Jul', revenue: 385000, orders: 190 },
      { month: 'Aug', revenue: totalRevenue > 0 ? totalRevenue : 420000, orders: totalOrders > 0 ? totalOrders : 210 }
    ];

    // Popular products
    const popularProducts = products.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.salePrice || p.price,
      stock: p.stock,
      soldCount: Math.floor(Math.random() * 40) + 10,
      image: p.thumbnail
    }));

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      todaysOrders,
      totalProducts: products.length,
      lowStockProducts,
      outOfStockProducts,
      pendingPayments,
      monthlyRevenue,
      popularProducts
    };
  }
}

export const db = new Database();
