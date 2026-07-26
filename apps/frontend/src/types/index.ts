export type Language = 'bn' | 'en';

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  nameBn: string;
  nameEn: string;
  sku: string;
  price: number;
  discount?: number;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  titleBn: string;
  titleEn: string;
  slug: string;
  descriptionBn: string;
  descriptionEn: string;
  categoryId: string;
  category?: Category;
  basePrice: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  unit: string;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEnd?: string;
  images: string[];
  videoUrl?: string;
  ratingAvg: number;
  ratingCount: number;
  tags: string[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'SSLCOMMERZ';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderShippingInfo {
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  streetAddress: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: OrderStatus;
  trxId?: string;
  items: CartItem[];
  shippingDetail: OrderShippingInfo;
  createdAt: string;
}
