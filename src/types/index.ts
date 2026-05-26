// src/types/index.ts — mirrors Android app data models exactly

export type PricingTier = 'RETAIL' | 'WHOLESALE' | 'BULK'

export type OrderStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'CONFIRMED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED'

export const ORDER_STATUS_LABELS: Record<OrderStatus, { en: string; ta: string; color: string }> = {
  PENDING:    { en: 'Pending',    ta: 'நிலுவையில்',             color: '#FF9800' },
  CONTACTED:  { en: 'Contacted',  ta: 'தொடர்பு கொண்டனர்',      color: '#2196F3' },
  CONFIRMED:  { en: 'Confirmed',  ta: 'உறுதிப்படுத்தப்பட்டது', color: '#00BCD4' },
  DISPATCHED: { en: 'Dispatched', ta: 'அனுப்பப்பட்டது',         color: '#9C27B0' },
  DELIVERED:  { en: 'Delivered',  ta: 'வழங்கப்பட்டது',          color: '#4CAF50' },
  CANCELLED:  { en: 'Cancelled',  ta: 'ரத்து செய்யப்பட்டது',   color: '#F44336' },
}

export interface ProductVariant {
  id:         string
  size:       string
  color:      string
  count:      string
  price:      number
  stockCount: number
  isActive:   boolean
}

export interface Product {
  id:              string
  name:            string
  nameTamil:       string
  categoryId:      string
  description:     string
  descriptionTamil:string
  retailPrice:     number
  wholesalePrice:  number
  bulkPrice:       number
  retailMinQty:    number
  wholesaleMinQty: number
  bulkMinQty:      number
  unit:            string
  stock:           string
  stockCount:      number
  images:          string[]
  youtubeUrl:      string
  isFeatured:      boolean
  isOffer:         boolean
  offerPercent:    number
  isActive:        boolean
  tags:            string[]
  hasVariants:     boolean
  variants:        ProductVariant[]
}

export interface Category {
  id:          string
  name:        string
  nameTamil:   string
  description: string
  icon:        string
  sortOrder:   number
  isActive:    boolean
}

export interface ComboItem {
  productId: string
  quantity:  number
  name:      string
}

export interface Combo {
  id:            string
  name:          string
  nameTamil:     string
  description:   string
  retailPrice:   number
  wholesalePrice:number
  bulkPrice:     number
  items:         ComboItem[]
  isFeatured:    boolean
  isActive:      boolean
  tag:           string
}

export interface Banner {
  id:          string
  title:       string
  titleTamil:  string
  image:       string
  actionType:  string
  actionId:    string
  sortOrder:   number
  isActive:    boolean
}

export interface AppConfig {
  shopName:           string
  shopNameTamil:      string
  tagline:            string
  phone1:             string
  phone2:             string
  whatsapp:           string
  address:            string
  minimumOrderValue:  number
  businessHours:      string
  maintenanceMode:    boolean
  maintenanceMessage: string
}

export interface CartItem {
  productId:       string
  productName:     string
  productNameTamil:string
  variantId:       string
  variantDesc:     string
  price:           number
  tier:            PricingTier
  quantity:        number
  stockCount:      number
  isCombo:         boolean
}

export interface CartSummary {
  items:           CartItem[]
  subtotal:        number
  totalQty:        number
  dominantTier:    PricingTier
  hasStockWarning: boolean
}

export interface OrderItem {
  productId:       string
  productName:     string
  productNameTamil:string
  variantDesc:     string
  quantity:        number
  price:           number
  tier:            string
  isCombo:         boolean
}

export interface Order {
  id:               string
  mobileNumber:     string
  customerName:     string
  deliveryArea:     string
  items:            OrderItem[]
  totalAmount:      number
  orderType:        PricingTier
  status:           OrderStatus
  timestamp:        number
  notes:            string
  adminNotes:       string
  estimatedDelivery:string
  trackingInfo:     string
  updatedAt:        number
}
