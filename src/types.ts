export type CategoryType = 
  | 'shirts'
  | 't-shirts'
  | 'polo-shirts'
  | 'pants'
  | 'jeans'
  | 'overshirts'
  | 'accessories'
  | 'new-arrivals'
  | 'best-sellers';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
  featured?: boolean;
  order: number;
}

export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  sku: string;
  stock: number;
  variants?: ProductVariant[];
  images: string[];
  thumbnail: string;
  colors: string[];
  sizes: string[];
  material: string;
  features: string[];
  tags: string[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  published: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  maxStock: number;
  sku: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'cod';

export type PaymentStatus = 
  | 'pending'
  | 'verified'
  | 'failed'
  | 'refunded';

export type OrderStatus =
  | 'Pending'
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  sku: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  thanaArea: string;
  postalCode?: string;
  customerNotes?: string;
  adminNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  senderPhone?: string;
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  district?: string;
  thanaArea?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'superadmin';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  brandStatement: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  bkashNumber: string;
  nagadNumber: string;
  enableCod: boolean;
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  dhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
  facebookUrl: string;
  instagramUrl: string;
  currencySymbol: string;
  currencyCode: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  availability: 'all' | 'in-stock' | 'on-sale';
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'best-seller';
  searchQuery: string;
}

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Gazipur', 'Narayanganj', 'Sylhet', 'Rajshahi',
  'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Bogra',
  'Cox\'s Bazar', 'Jessore', 'Dinajpur', 'Tangail', 'Faridpur', 'Narsingdi',
  'Feni', 'Noakhali', 'Brahmanbaria', 'Kushtia', 'Pabna', 'Sirajganj',
  'Jamalpur', 'Naogaon', 'Satkhira', 'Natore', 'Joypurhat', 'Chapainawabganj',
  'Jhenaidah', 'Magura', 'Narail', 'Bagerhat', 'Chuadanga', 'Meherpur',
  'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna', 'Habiganj',
  'Moulvibazar', 'Sunamganj', 'Chandpur', 'Lakshmipur', 'Gopalganj',
  'Madaripur', 'Manikganj', 'Munshiganj', 'Rajbari', 'Shariatpur',
  'Kishoreganj', 'Netrokona', 'Sherpur', 'Kurigram', 'Gaibandha',
  'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Bandarban',
  'Khagrachhari', 'Rangamati'
] as const;

