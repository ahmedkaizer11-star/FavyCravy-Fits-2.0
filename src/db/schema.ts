import { pgTable, text, integer, boolean, timestamp, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

// 1. Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  itemCount: integer('item_count').default(0)
});

// 2. Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sku: text('sku').notNull().unique(),
  description: text('description').notNull(),
  details: text('details'),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  salePrice: integer('sale_price'),
  costPrice: integer('cost_price'),
  stock: integer('stock').notNull().default(0),
  colors: jsonb('colors').$type<string[]>().default([]),
  sizes: jsonb('sizes').$type<string[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),
  thumbnail: text('thumbnail').notNull(),
  isFeatured: boolean('is_featured').default(false),
  isNewArrival: boolean('is_new_arrival').default(false),
  isBestSeller: boolean('is_best_seller').default(false),
  rating: doublePrecision('rating').default(5.0),
  reviewCount: integer('review_count').default(0),
  createdAt: text('created_at').notNull()
});

// 3. Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  shippingAddress: text('shipping_address').notNull(),
  district: text('district').notNull(),
  thanaArea: text('thana_area'),
  items: jsonb('items').$type<any[]>().notNull(),
  subtotal: integer('subtotal').notNull(),
  shippingFee: integer('shipping_fee').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  total: integer('total').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'cod' | 'bkash' | 'nagad'
  paymentStatus: text('payment_status').notNull().default('pending'), // 'pending' | 'verified' | 'failed'
  orderStatus: text('order_status').notNull().default('Pending'), // 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  transactionId: text('transaction_id'),
  senderPhone: text('sender_phone'),
  notes: text('notes'),
  trackingSteps: jsonb('tracking_steps').$type<any[]>().default([]),
  createdAt: text('created_at').notNull()
});

// 4. Customers Table
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull().unique(),
  address: text('address').notNull(),
  district: text('district').notNull(),
  thanaArea: text('thana_area'),
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: integer('total_spent').notNull().default(0),
  createdAt: text('created_at').notNull()
});

// 5. Admins Table
export const admins = pgTable('admins', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  mustChangePassword: boolean('must_change_password').default(false)
});

// 6. Settings Table
export const settings = pgTable('settings', {
  id: text('id').primaryKey().default('main_settings'),
  storeName: text('store_name').notNull(),
  tagline: text('tagline'),
  phone: text('phone').notNull(),
  bkashNumber: text('bkash_number').notNull(),
  nagadNumber: text('nagad_number').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  freeDeliveryThreshold: integer('free_delivery_threshold').default(0),
  deliveryFee: integer('delivery_fee').default(0),
  currencySymbol: text('currency_symbol').default('৳'),
  currencyCode: text('currency_code').default('BDT'),
  announcementText: text('announcement_text'),
  announcementActive: boolean('announcement_active').default(true),
  facebookUrl: text('facebook_url'),
  instagramUrl: text('instagram_url')
});

// 7. Reviews Table
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull().default(5),
  comment: text('comment').notNull(),
  verifiedPurchase: boolean('verified_purchase').default(true),
  createdAt: text('created_at').notNull()
});
