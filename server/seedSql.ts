import { sqlDb } from '../src/db/index.ts';
import { products, categories, orders, customers, admins, settings, reviews } from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './seedData.js';
import bcrypt from 'bcryptjs';

export async function seedCloudSql() {
  try {
    if (!process.env.SQL_HOST || !process.env.SQL_USER) {
      console.log('No SQL credentials present, skipping Cloud SQL seed');
      return;
    }

    // 1. Seed Settings
    const existingSettings = await sqlDb.select().from(settings).limit(1);
    if (existingSettings.length === 0) {
      await sqlDb.insert(settings).values({
        id: 'main_settings',
        storeName: INITIAL_SETTINGS.storeName,
        tagline: INITIAL_SETTINGS.tagline,
        phone: INITIAL_SETTINGS.phone,
        bkashNumber: INITIAL_SETTINGS.bkashNumber,
        nagadNumber: INITIAL_SETTINGS.nagadNumber,
        email: INITIAL_SETTINGS.email,
        address: INITIAL_SETTINGS.address,
        freeDeliveryThreshold: INITIAL_SETTINGS.freeDeliveryThreshold,
        deliveryFee: 0,
        currencySymbol: '৳',
        currencyCode: 'BDT',
        announcementText: '🔥 FREE Home Delivery Nationwide across Bangladesh on all orders!',
        announcementActive: true,
        facebookUrl: INITIAL_SETTINGS.facebookUrl,
        instagramUrl: INITIAL_SETTINGS.instagramUrl
      });
      console.log('Seeded Cloud SQL store settings.');
    }

    // 2. Seed Admins
    const existingAdmins = await sqlDb.select().from(admins).limit(1);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin123', salt);

    if (existingAdmins.length === 0) {
      await sqlDb.insert(admins).values({
        id: 'admin-1',
        username: 'mrkbd',
        passwordHash,
        name: 'Master Admin',
        role: 'superadmin',
        mustChangePassword: false
      });
      console.log('Seeded Cloud SQL master admin.');
    } else {
      // Ensure master admin has username mrkbd and password admin123
      await sqlDb.update(admins).set({
        username: 'mrkbd',
        passwordHash
      }).where(eq(admins.id, existingAdmins[0].id));
      console.log('Updated Cloud SQL master admin credentials to mrkbd / admin123.');
    }

    // 3. Seed Categories
    const existingCats = await sqlDb.select().from(categories).limit(1);
    if (existingCats.length === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await sqlDb.insert(categories).values({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          imageUrl: cat.image,
          itemCount: 0
        });
      }
      console.log('Seeded Cloud SQL categories.');
    }

    // 4. Seed Products
    const existingProds = await sqlDb.select().from(products).limit(1);
    if (existingProds.length === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await sqlDb.insert(products).values({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          description: p.description,
          details: p.material || '',
          category: p.category,
          price: p.price,
          salePrice: p.salePrice || null,
          costPrice: (p as any).costPrice || null,
          stock: p.stock,
          colors: p.colors || [],
          sizes: p.sizes || [],
          images: p.images || [],
          thumbnail: p.thumbnail,
          isFeatured: !!p.featured,
          isNewArrival: !!p.newArrival,
          isBestSeller: !!p.bestSeller,
          rating: p.rating || 5.0,
          reviewCount: p.reviewCount || 0,
          createdAt: p.createdAt || new Date().toISOString()
        });
      }
      console.log('Seeded Cloud SQL products.');
    }
  } catch (err) {
    console.error('Error seeding Cloud SQL:', err);
  }
}
