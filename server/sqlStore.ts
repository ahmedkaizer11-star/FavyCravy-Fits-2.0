import { sqlDb } from '../src/db/index.ts';
import { products, categories, orders, customers, admins, settings, reviews } from '../src/db/schema.ts';
import { eq, desc, asc, and, gte, lte, ilike, or } from 'drizzle-orm';
import { Product, Category, Order, Customer, StoreSettings, Review } from '../src/types.js';

export const sqlStore = {
  // Check if connected
  async isAvailable(): Promise<boolean> {
    try {
      if (!process.env.SQL_HOST || !process.env.SQL_USER) return false;
      await sqlDb.select().from(settings).limit(1);
      return true;
    } catch {
      return false;
    }
  },

  // Products
  async getProducts(options?: {
    category?: string;
    search?: string;
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
  }) {
    try {
      let query = sqlDb.select().from(products);
      const res = await query;
      return res;
    } catch (err) {
      console.error('SQL getProducts error:', err);
      throw err;
    }
  },

  async insertProduct(p: any) {
    return await sqlDb.insert(products).values(p).returning();
  },

  async updateProduct(id: string, p: any) {
    return await sqlDb.update(products).set(p).where(eq(products.id, id)).returning();
  },

  async deleteProduct(id: string) {
    return await sqlDb.delete(products).where(eq(products.id, id));
  },

  // Categories
  async getCategories() {
    return await sqlDb.select().from(categories);
  },

  async insertCategory(c: any) {
    return await sqlDb.insert(categories).values(c).returning();
  },

  // Orders
  async getOrders() {
    return await sqlDb.select().from(orders).orderBy(desc(orders.createdAt));
  },

  async insertOrder(o: any) {
    return await sqlDb.insert(orders).values(o).returning();
  },

  async updateOrder(id: string, updates: any) {
    return await sqlDb.update(orders).set(updates).where(eq(orders.id, id)).returning();
  },

  // Settings
  async getSettings() {
    const res = await sqlDb.select().from(settings).where(eq(settings.id, 'main_settings')).limit(1);
    return res[0] || null;
  },

  async upsertSettings(s: any) {
    const existing = await this.getSettings();
    if (existing) {
      return await sqlDb.update(settings).set(s).where(eq(settings.id, 'main_settings')).returning();
    } else {
      return await sqlDb.insert(settings).values({ id: 'main_settings', ...s }).returning();
    }
  },

  // Admins
  async getAdmin(username: string) {
    const res = await sqlDb.select().from(admins).where(eq(admins.username, username.toLowerCase())).limit(1);
    return res[0] || null;
  },

  async insertAdmin(adm: any) {
    return await sqlDb.insert(admins).values(adm).returning();
  },

  async updateAdminPassword(username: string, passwordHash: string) {
    return await sqlDb.update(admins).set({ passwordHash, mustChangePassword: false }).where(eq(admins.username, username.toLowerCase())).returning();
  }
};
