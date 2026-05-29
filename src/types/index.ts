// src/types/index.ts — mirrors Android app data models exactly

export type PricingTier = 'RETAIL' | 'WHOLESALE' | 'BULK'

export type OrderStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'CONFIRMED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED'

export const ORDER_STATUS_LABELS: Record<OrderStatus, { en: string; ta: string; color: string; bg: string }> = {
  PENDING:    { en: 'Pending',    ta: 'நிலுவையில்',             color: '#FF9800', bg: 'rgba(255,152,0,0.15)'   },
  CONTACTED:  { en: 'Contacted',  ta: 'தொடர்பு கொண்டனர்',      color: '#2196F3', bg: 'rgba(33,150,243,0.15)'  },
  CONFIRMED:  { en: 'Confirmed',  ta: 'உறுதிப்படுத்தப்பட்டது', color: '#00BCD4', bg: 'rgba(0,188,212,0.15)'   },
  DISPATCHED: { en: 'Dispatched', ta: 'அனுப்பப்பட்டது',         color: '#9C27B0', bg: 'rgba(156,39,176,0.15)'  },
  DELIVERED:  { en: 'Delivered',  ta: 'வழங்கப்பட்டது',          color: '#4CAF50', bg: 'rgba(76,175,80,0.15)'   },
  CANCELLED:  { en: 'Cancelled',  ta: 'ரத்து செய்யப்பட்டது',   color: '#F44336', bg: 'rgba(244,67,54,0.15)'   },
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
  id:               string
  name:             string
  nameTamil:        string
  categoryId:       string
  description:      string
  descriptionTamil: string
  retailPrice:      number
  wholesalePrice:   number
  bulkPrice:        number
  retailMinQty:     number
  wholesaleMinQty:  number
  bulkMinQty:       number
  unit:             string
  stock:            string   // 'available' | 'out_of_stock'
  stockCount:       number
  images:           string[]
  youtubeUrl:       string
  isFeatured:       boolean
  isOffer:          boolean
  offerPercent:     number
  isActive:         boolean
  tags:             string[]
  hasVariants:      boolean
  variants:         ProductVariant[]
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
  // Shop Identity
  shopName:           string
  shopNameTamil:      string
  tagline:            string
  // Contact
  phone1:             string
  phone2:             string
  whatsapp:           string
  email:              string
  // Location
  address:            string
  mapsLink:           string
  // Hours & Order
  businessHours:      string
  minimumOrderValue:  number
  // Social Media
  instagram:          string
  facebook:           string
  youtube:            string
  // Content Pages
  aboutUs:            string
  termsAndConditions: string
  privacyPolicy:      string
  helpText:           string
  // Maintenance
  maintenanceMode:       boolean
  maintenanceMessage:    string
  // Stock Management
  enableStockManagement: boolean
}

export interface CartItem {
  productId:        string
  productName:      string
  productNameTamil: string
  variantId:        string
  variantDesc:      string
  price:            number
  tier:             PricingTier
  quantity:         number
  stockCount:       number
  isCombo:          boolean
}

export interface OrderItem {
  productId:        string
  productName:      string
  productNameTamil: string
  variantDesc:      string
  categoryId:       string
  quantity:         number
  price:            number
  tier:             string
  isCombo:          boolean
}

export interface Order {
  id:               string
  mobileNumber:     string
  customerName:     string
  deliveryArea:     string
  items:            OrderItem[]
  totalAmount:      number
  orderType:        string
  status:           OrderStatus
  timestamp:        number
  notes:            string
  adminNotes:       string
  estimatedDelivery:string
  trackingInfo:     string
  updatedAt:        number
}

export interface DashboardStats {
  totalOrders:      number
  pendingOrders:    number
  contactedOrders:  number
  confirmedOrders:  number
  dispatchedOrders: number
  todayOrders:      number
  totalRevenue:     number
  todayRevenue:     number
  totalProducts:    number
  activeProducts:   number
  lowStockCount:    number
  totalCategories:  number
  totalCombos:      number
}
