import { Product, Category, StoreSettings } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Favy Cravy Fits 2.0',
  tagline: 'Wear Distinction | Own the Moment',
  brandStatement: 'Modern. Minimal. Magnetic. Contemporary menswear engineered with precision for the modern Bangladeshi man.',
  phone: '01843667400',
  whatsapp: '01843667400',
  email: 'support@favycravyfits.com',
  address: 'Road 11, Block D, Banani',
  city: 'Dhaka',
  country: 'Bangladesh',
  bkashNumber: '01843667400',
  nagadNumber: '01843667400',
  enableCod: true,
  freeDeliveryEnabled: true,
  freeDeliveryThreshold: 0, // Free Home Delivery across Bangladesh
  standardDeliveryFee: 0,
  dhakaDeliveryFee: 0,
  outsideDhakaDeliveryFee: 0,
  facebookUrl: 'https://facebook.com/favycravyfits',
  instagramUrl: 'https://instagram.com/favycravyfits',
  currencySymbol: '৳',
  currencyCode: 'BDT',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Shirts',
    slug: 'shirts',
    description: 'Crisp Oxford weaves, linen blends, and structured formal & casual shirts.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    order: 1,
    featured: true
  },
  {
    id: 'cat-2',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Heavyweight 240+ GSM combed cotton tees with minimalist silhouette.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    order: 2,
    featured: true
  },
  {
    id: 'cat-3',
    name: 'Polo Shirts',
    slug: 'polo-shirts',
    description: 'Luxury pique knit and Mercerized cotton polos for refined downtime.',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    order: 3,
    featured: true
  },
  {
    id: 'cat-4',
    name: 'Pants',
    slug: 'pants',
    description: 'Tailored trousers, pleated chinos, and ankle-crop smart casual pants.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    order: 4,
    featured: true
  },
  {
    id: 'cat-5',
    name: 'Jeans',
    slug: 'jeans',
    description: 'Selvedge denim, tapered fits, and comfortable stretch everyday jeans.',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    order: 5,
    featured: true
  },
  {
    id: 'cat-6',
    name: 'Overshirts',
    slug: 'overshirts',
    description: 'Heavy twill shackets, corduroy jackets, and modular layering pieces.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    order: 6,
    featured: true
  },
  {
    id: 'cat-7',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Genuine leather belts, minimalist wallets, and essential accents.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    order: 7,
    featured: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Oxford Full-Sleeve Shirt',
    slug: 'premium-oxford-full-sleeve-shirt',
    description: 'Crafted from 100% long-staple Egyptian cotton with a durable Oxford basketweave. Tailored with a modern slim-regular taper, button-down collar, and mother-of-pearl buttons. Ideal for office sophistication or evening events in Dhaka.',
    shortDescription: '100% Egyptian cotton Oxford shirt with crisp tailored fit.',
    category: 'Shirts',
    categorySlug: 'shirts',
    subcategory: 'Formal / Casual',
    price: 1890,
    salePrice: 1490,
    discountPercentage: 21,
    sku: 'FCF-SH-001',
    stock: 24,
    variants: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 4 },
      { size: 'XXL', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    colors: ['Classic White', 'Sky Blue', 'Charcoal Black', 'Sage Green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '100% Long-Staple Cotton (160 GSM)',
    features: [
      'Wrinkle-resistant luxury Oxford weave',
      'Reinforced gusset stitching for longevity',
      'Concealed collar stay pockets',
      'Machine wash cold, gentle cycle'
    ],
    tags: ['shirt', 'oxford', 'formal', 'office', 'casual', 'bestseller'],
    featured: true,
    newArrival: true,
    bestSeller: true,
    published: true,
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-20T12:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Heavyweight Minimalist Crew Tee (240 GSM)',
    slug: 'heavyweight-minimalist-crew-tee-240-gsm',
    description: 'The definitive everyday tee. Cut from heavyweight 240 GSM organic combed cotton with drop-shoulder silhouette, tight ribbed collar that never sags, and zero external branding. Engineered for all-day comfort and masculine structure.',
    shortDescription: 'Heavyweight 240 GSM drop-shoulder boxy tee.',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    subcategory: 'Streetwear & Basics',
    price: 1190,
    salePrice: 890,
    discountPercentage: 25,
    sku: 'FCF-TS-002',
    stock: 45,
    variants: [
      { size: 'M', stock: 15 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 4 }
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    colors: ['Onyx Black', 'Off-White', 'Olive Moss', 'Slate Grey'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    material: '100% Combed Compact Cotton (240 GSM)',
    features: [
      'High-density 1x1 rib knit collar with anti-stretch tape',
      'Pre-shrunk fabric to prevent post-wash shrinkage',
      'Side-seamed construction for structural integrity'
    ],
    tags: ['t-shirt', 'oversized', 'heavyweight', 'streetwear', 'basics'],
    featured: true,
    newArrival: true,
    bestSeller: true,
    published: true,
    rating: 4.8,
    reviewCount: 52,
    createdAt: '2026-08-12T09:00:00Z',
    updatedAt: '2026-08-22T14:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Mercerized Knit Polo Shirt',
    slug: 'mercerized-knit-polo-shirt',
    description: 'Elevate your casual wardrobe with our signature Mercerized cotton polo. The specialized double-mercerizing process creates an ultra-smooth handfeel with a subtle sheen, clean open collar, and tailored sleeve cuffs.',
    shortDescription: 'Signature Mercerized cotton polo with clean collar design.',
    category: 'Polo Shirts',
    categorySlug: 'polo-shirts',
    subcategory: 'Smart Casual',
    price: 1690,
    salePrice: 1390,
    discountPercentage: 17,
    sku: 'FCF-PL-003',
    stock: 19,
    variants: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 3 }
    ],
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    colors: ['Midnight Navy', 'Pure Black', 'Burgundy', 'Forest Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Double-Mercerized Cotton (210 GSM)',
    features: [
      'Seamless knitted collar that lays flat without curling',
      'Tone-on-tone matte buttons',
      'Breathable, moisture-wicking structure'
    ],
    tags: ['polo', 'mercerized', 'smart-casual', 'luxury'],
    featured: true,
    newArrival: false,
    bestSeller: true,
    published: true,
    rating: 5.0,
    reviewCount: 29,
    createdAt: '2026-08-05T14:30:00Z',
    updatedAt: '2026-08-18T10:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Tailored Ankle-Crop Pleated Trousers',
    slug: 'tailored-ankle-crop-pleated-trousers',
    description: 'Modern sartorial mastery. Features single reverse pleats, side-adjusters for a belt-free clean waistline, and an effortless tapered leg cropped right above the footwear. Blended with poly-viscose and elastane for crease resistance.',
    shortDescription: 'Single-pleat tailored trousers with side adjusters.',
    category: 'Pants',
    categorySlug: 'pants',
    subcategory: 'Formal & Smart Casual',
    price: 2490,
    salePrice: 1990,
    discountPercentage: 20,
    sku: 'FCF-PT-004',
    stock: 14,
    variants: [
      { size: '30', stock: 3 },
      { size: '32', stock: 5 },
      { size: '34', stock: 4 },
      { size: '36', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    colors: ['Charcoal Grey', 'Deep Navy', 'Mocha Brown', 'Black'],
    sizes: ['30', '32', '34', '36'],
    material: '68% Poly, 28% Viscose, 4% Spandex (320 GSM)',
    features: [
      'Traditional stainless steel side-tab adjusters',
      'French fly with inner button closure for clean drape',
      'Deep functional slant pockets'
    ],
    tags: ['pants', 'trousers', 'pleated', 'tailored', 'smart-casual'],
    featured: true,
    newArrival: true,
    bestSeller: false,
    published: true,
    rating: 4.9,
    reviewCount: 21,
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-08-21T16:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Raw Indigo Tapered Selvedge Jeans',
    slug: 'raw-indigo-tapered-selvedge-jeans',
    description: 'Constructed from 13.5 oz authentic shuttle-loom selvedge denim with classic red-line edge. Sanforized raw indigo that breaks in uniquely to your body over time. Custom hardware and durable pocket bags.',
    shortDescription: '13.5 oz authentic selvedge denim with slim-tapered cut.',
    category: 'Jeans',
    categorySlug: 'jeans',
    subcategory: 'Denim',
    price: 2790,
    salePrice: 2290,
    discountPercentage: 18,
    sku: 'FCF-JN-005',
    stock: 12,
    variants: [
      { size: '30', stock: 2 },
      { size: '32', stock: 4 },
      { size: '34', stock: 4 },
      { size: '36', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    colors: ['Raw Indigo', 'Washed Vintage Grey', 'Jet Black'],
    sizes: ['30', '32', '34', '36'],
    material: '98% Cotton, 2% Elastane Selvedge Denim (13.5 oz)',
    features: [
      'Signature red-line selvedge visible at cuff',
      'Solid brass zipper fly with heavy-duty donut button',
      'Chain-stitched waistband and leg hems'
    ],
    tags: ['jeans', 'selvedge', 'denim', 'indigo'],
    featured: false,
    newArrival: true,
    bestSeller: true,
    published: true,
    rating: 4.7,
    reviewCount: 31,
    createdAt: '2026-08-08T08:00:00Z',
    updatedAt: '2026-08-19T13:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Heavy Cotton Twill Utility Overshirt',
    slug: 'heavy-cotton-twill-utility-overshirt',
    description: 'The ultimate outerwear-meets-shirt hybrid. Engineered from rugged 340 GSM cotton twill, featuring twin oversized chest flap pockets, reinforced elbow patches, and relaxed layering cut designed to wear over tees or hoodies.',
    shortDescription: '340 GSM heavy twill overshirt with utility chest pockets.',
    category: 'Overshirts',
    categorySlug: 'overshirts',
    subcategory: 'Outerwear & Layering',
    price: 2690,
    salePrice: 2190,
    discountPercentage: 19,
    sku: 'FCF-OS-006',
    stock: 16,
    variants: [
      { size: 'M', stock: 5 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 4 }
    ],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    colors: ['Khaki Tan', 'Military Olive', 'Washed Black'],
    sizes: ['M', 'L', 'XL'],
    material: '100% Heavyweight Cotton Twill (340 GSM)',
    features: [
      'Dual bellowed chest pockets with snap closures',
      'Heavy-gauge YKK front zip and button placket',
      'Adjustable barrel cuffs'
    ],
    tags: ['overshirt', 'shacket', 'jacket', 'utility', 'layering'],
    featured: true,
    newArrival: true,
    bestSeller: false,
    published: true,
    rating: 4.9,
    reviewCount: 16,
    createdAt: '2026-08-16T15:00:00Z',
    updatedAt: '2026-08-22T11:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Textured Waffle Knit Long-Sleeve',
    slug: 'textured-waffle-knit-long-sleeve',
    description: 'Designed for effortless depth and texture. Rich waffle grid knit with a relaxed crew neck and ribbed cuffs. Provides subtle thermal regulation for indoor air conditioning and breezy Dhaka evenings.',
    shortDescription: 'Thermal waffle-weave knit crewneck with rib cuffs.',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    subcategory: 'Long Sleeve',
    price: 1390,
    salePrice: 1090,
    discountPercentage: 22,
    sku: 'FCF-LS-007',
    stock: 20,
    variants: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 3 }
    ],
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    colors: ['Oatmeal Heather', 'Charcoal', 'Washed Olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Breathable Cotton Waffle (260 GSM)',
    features: [
      'Geometric micro-waffle texture for luxury drape',
      'Double-stitched hem and durable cuff retention'
    ],
    tags: ['t-shirt', 'long-sleeve', 'waffle', 'textured'],
    featured: false,
    newArrival: true,
    bestSeller: false,
    published: true,
    rating: 4.8,
    reviewCount: 14,
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-20T08:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Men’s Short-Sleeve Geometric Resort Shirt',
    slug: 'relaxed-fit-linen-blend-summer-shirt',
    description: 'Ultra-breathable linen and cotton blend designed specifically for the sub-tropical Bangladesh climate. Features a camp Cuban collar, straight hem with side vents, and clean minimalist silhouette.',
    shortDescription: '100% Cotton • 130–140 GSM • Light Grey & White • Geometric Pattern • Breathable Summer Fabric • Relaxed Fit • Cuban Collar',
    category: 'Short Sleeve',
    categorySlug: 'short-sleeve',
    subcategory: 'Casual / Resort',
    price: 1890,
    salePrice: 1490,
    discountPercentage: 21,
    sku: 'FCF-LN-008',
    stock: 18,
    variants: [
      { size: 'M', stock: 6 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 4 }
    ],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    colors: ['Light Grey / Stone Grey'],
    sizes: ['M', 'L', 'XL'],
    material: '100% Cotton (Lightweight woven shirting)',
    features: [
      'Summer-friendly lightweight construction',
      'Breathable fabric for warm and humid weather',
      'Soft, comfortable hand feel',
      'Eye-catching geometric vertical pattern',
      'Modern Cuban/resort collar',
      'Relaxed contemporary silhouette',
      'Short sleeves for improved airflow',
      'Button-front closure',
      'Lightweight drape without looking overly thin',
      'Easy to style with white, cream, beige or khaki trousers',
      'Suitable for vacations, resort wear, brunches, casual outings and evening events'
    ],
    tags: ['shirt', 'linen', 'summer', 'cuban-collar', 'bestseller'],
    featured: true,
    newArrival: false,
    bestSeller: true,
    published: true,
    rating: 5.0,
    reviewCount: 44,
    createdAt: '2026-08-01T12:00:00Z',
    updatedAt: '2026-08-27T22:58:44.733Z'
  }
];
