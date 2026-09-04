export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserPayload {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: UserPayload;
  token: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  children: CategoryTree[];
  _count?: { products: number };
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  currency: string;
  images: string[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductDetail extends ProductSummary {
  description: string;
  details: string | null;
  fabric: string | null;
  careInfo: string | null;
  included: string | null;
  tags: string[];
  variants: VariantInfo[];
}

export interface VariantInfo {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
}

export interface CartItemResponse {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  variant: VariantInfo | null;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItemResponse[];
  address: AddressResponse;
}

export interface OrderItemResponse {
  id: string;
  productName: string;
  size: string | null;
  color: string | null;
  quantity: number;
  price: number;
  image: string | null;
}

export interface AddressResponse {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface CreateAddressInput {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
}

export interface CreateOrderInput {
  addressId: string;
  notes?: string;
}

export interface AddToCartInput {
  productId: string;
  variantId?: string;
  quantity: number;
}
