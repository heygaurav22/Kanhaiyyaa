export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  sortOrder: number;
}

export interface Variant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details?: string;
  fabric?: string;
  careInfo?: string;
  included?: string;
  price: number; // in paise
  comparePrice?: number; // in paise
  currency: string;
  images: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  variants?: Variant[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  variantId?: string;
  variant?: {
    id: string;
    size?: string;
    color?: string;
    colorHex?: string;
    stock: number;
  };
  quantity: number;
}

export interface Address {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  createdAt: string;
}
