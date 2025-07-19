export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  tags: string[];
  discount?: number;
  inStock: boolean;
  featured?: boolean;
  description?: string;
  dosage?: string;
  composition?: string;
  usage?: string;
  sideEffects?: string;
  contraindications?: string;
  manufacturer?: string;
  brand?: string;
  type?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  successMessage: string | null;
}

export interface User {
  uid: string;
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt?: any;
  // Add other user properties as needed
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface ShippingZone {
  id: string;
  name: string;
  states: string[];
  standardPrice: number;
  expressPrice: number;
  standardDays: string;
  expressDays: string;
  cepRanges?: Array<{start: string; end: string}>;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount?: number; // alias for value
  minValue?: number;
  minPurchase?: number; // alias for minValue
  maxDiscount?: number;
  usageLimit?: number;
  maxUses?: number; // alias for usageLimit
  usageCount: number;
  usedCount?: number; // alias for usageCount
  expiresAt?: any;
  validUntil?: Date; // alias for expiresAt
  validFrom?: Date;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  personal: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    cep: string;
  };
  payment: {
    method: string;
    pixProofUrl?: string;
    total: number;
    subtotal: number;
    couponDiscount: number;
    pixDiscount: number;
    shippingPrice: number;
    notes?: string;
  };
  items: OrderItem[];
  coupon?: any;
  shipping?: any;
  newsletter: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}
