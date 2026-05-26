// src/lib/store.ts — Zustand global state
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, PricingTier } from '@/types'

interface CartState {
  items:       CartItem[]
  addItem:     (item: CartItem) => void
  removeItem:  (productId: string, variantId?: string) => void
  updateQty:   (productId: string, qty: number, variantId?: string) => void
  clearCart:   () => void
  totalQty:    () => number
  subtotal:    () => number
  dominantTier:() => PricingTier
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => set((s) => {
        const key   = newItem.variantId || newItem.productId
        const exists = s.items.find(
          i => (i.variantId || i.productId) === key
        )
        if (exists) {
          return {
            items: s.items.map(i =>
              (i.variantId || i.productId) === key
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          }
        }
        return { items: [...s.items, newItem] }
      }),

      removeItem: (productId, variantId) => set((s) => ({
        items: s.items.filter(i =>
          variantId
            ? !(i.productId === productId && i.variantId === variantId)
            : i.productId !== productId
        ),
      })),

      updateQty: (productId, qty, variantId) => set((s) => ({
        items: qty <= 0
          ? s.items.filter(i =>
              variantId
                ? !(i.productId === productId && i.variantId === variantId)
                : i.productId !== productId
            )
          : s.items.map(i =>
              (variantId
                ? i.productId === productId && i.variantId === variantId
                : i.productId === productId
              ) ? { ...i, quantity: qty } : i
            ),
      })),

      clearCart: () => set({ items: [] }),

      totalQty: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      dominantTier: (): PricingTier => {
        const qty = get().totalQty()
        if (qty >= 20) return 'BULK'
        if (qty >= 5)  return 'WHOLESALE'
        return 'RETAIL'
      },
    }),
    { name: 'pattasu-cart' }
  )
)

// Auth state (simple — not persisted for security)
interface AuthState {
  user:       { uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null
  loading:    boolean
  setUser:    (user: AuthState['user']) => void
  setLoading: (v: boolean) => void
  signOut:    () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:       null,
  loading:    true,
  setUser:    (user)    => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  signOut:    ()        => set({ user: null }),
}))
