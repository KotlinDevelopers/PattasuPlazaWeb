'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  addDoc, serverTimestamp, runTransaction, writeBatch,
  DocumentData, Timestamp,
} from 'firebase/firestore'
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage'
import { db, storage, auth } from '@/lib/firebase'
import type {
  Product, Category, Combo, Banner, AppConfig,
  Order, OrderStatus, DashboardStats,
} from '@/types'

// ── Admin check ───────────────────────────────────────────────────────────────

export async function checkIsAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'admins', uid))
    return snap.exists()
  } catch { return false }
}

// ── Real-time hooks ───────────────────────────────────────────────────────────

export function useAdminOrders(statusFilter?: OrderStatus) {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, snap => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
      if (statusFilter) list = list.filter(o => o.status === statusFilter)
      setOrders(list)
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [statusFilter])

  return { orders, loading }
}

export function useAdminProducts() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { products, loading }
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'categories'), orderBy('sortOrder')),
      snap => {
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { categories, loading }
}

export function useAdminCombos() {
  const [combos,  setCombos]  = useState<Combo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'combos'),
      snap => {
        const list = snap.docs.map(d => {
          const data = d.data()
          const itemsRaw = (data.items as any[]) || []
          return {
            id:            d.id,
            name:          data.name || '',
            nameTamil:     data.nameTamil || '',
            description:   data.description || '',
            retailPrice:   data.retailPrice || 0,
            wholesalePrice:data.wholesalePrice || 0,
            bulkPrice:     data.bulkPrice || 0,
            isFeatured:    data.isFeatured || false,
            isActive:      data.isActive ?? true,
            tag:           data.tag || '',
            items: itemsRaw.map((it: any) => ({
              productId: it.productId || '',
              quantity:  it.quantity  || 1,
              name:      it.name      || '',
            })),
          } as Combo
        })
        setCombos(list)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { combos, loading }
}

export function useAdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'banners'),
      snap => {
        setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner))
          .sort((a, b) => a.sortOrder - b.sortOrder))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [])

  return { banners, loading }
}

export function useAdminConfig() {
  const [config,  setConfig]  = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'app'), snap => {
      if (snap.exists()) setConfig(snap.data() as AppConfig)
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  return { config, loading }
}

export function useDashboardStats(
  products: Product[],
  orders: Order[],
  categories: Category[],
  combos: Combo[]
): DashboardStats {
  const now      = Date.now()
  const dayStart = now - 86_400_000
  const today    = orders.filter(o => o.timestamp >= dayStart)

  return {
    totalOrders:      orders.length,
    pendingOrders:    orders.filter(o => o.status === 'PENDING').length,
    contactedOrders:  orders.filter(o => o.status === 'CONTACTED').length,
    confirmedOrders:  orders.filter(o => o.status === 'CONFIRMED').length,
    dispatchedOrders: orders.filter(o => o.status === 'DISPATCHED').length,
    todayOrders:      today.length,
    totalRevenue:     orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0),
    todayRevenue:     today.reduce((s, o) => s + o.totalAmount, 0),
    totalProducts:    products.length,
    activeProducts:   products.filter(p => p.isActive).length,
    lowStockCount:    products.filter(p => p.stockCount > 0 && p.stockCount <= 10).length,
    totalCategories:  categories.length,
    totalCombos:      combos.length,
  }
}

// ── Write operations ──────────────────────────────────────────────────────────

export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<string> {
  const id  = product.id?.trim() || doc(collection(db, 'products')).id
  await setDoc(doc(db, 'products', id), { ...product, id }, { merge: true })
  return id
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id))
}

export async function toggleProductField(id: string, field: 'isActive' | 'isFeatured', value: boolean) {
  await updateDoc(doc(db, 'products', id), { [field]: value })
}

export async function updateStock(productId: string, newStock: number) {
  await updateDoc(doc(db, 'products', productId), {
    stockCount: newStock,
    stock:      newStock > 0 ? 'available' : 'out_of_stock',
  })
}

export async function saveCategory(category: Partial<Category> & { id?: string }): Promise<string> {
  const id = category.id?.trim() || doc(collection(db, 'categories')).id
  await setDoc(doc(db, 'categories', id), { ...category, id }, { merge: true })
  return id
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, 'categories', id))
}

export async function saveCombo(combo: Partial<Combo> & { id?: string }): Promise<string> {
  const id = combo.id?.trim() || doc(collection(db, 'combos')).id
  await setDoc(doc(db, 'combos', id), { ...combo, id }, { merge: true })
  return id
}

export async function deleteCombo(id: string) {
  await deleteDoc(doc(db, 'combos', id))
}

export async function saveBanner(banner: Partial<Banner> & { id?: string }): Promise<string> {
  const id = banner.id?.trim() || doc(collection(db, 'banners')).id
  await setDoc(doc(db, 'banners', id), { ...banner, id }, { merge: true })
  return id
}

export async function deleteBanner(id: string) {
  await deleteDoc(doc(db, 'banners', id))
}

export async function saveConfig(config: AppConfig) {
  await setDoc(doc(db, 'config', 'app'), config, { merge: true })
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminNotes = '',
  trackingInfo = '',
  estimatedDelivery = ''
) {
  const fields: Record<string, any> = {
    status,
    updatedAt: Date.now(),
  }
  if (adminNotes)        fields.adminNotes        = adminNotes
  if (trackingInfo)      fields.trackingInfo      = trackingInfo
  if (estimatedDelivery) fields.estimatedDelivery = estimatedDelivery

  // Decrement stock when CONFIRMED
  if (status === 'CONFIRMED') {
    const orderSnap = await getDoc(doc(db, 'orders', orderId))
    if (orderSnap.exists()) {
      const order = orderSnap.data() as Order
      const batch = writeBatch(db)
      order.items?.forEach(item => {
        if (!item.isCombo && item.productId) {
          // We use a batch update here; for true concurrent safety use runTransaction
          // but for admin use batch is fine
          batch.update(doc(db, 'products', item.productId), {
            stockCount: Math.max(0, (item as any).stockCount - item.quantity),
          })
        }
      })
      await batch.commit()
    }
  }

  await updateDoc(doc(db, 'orders', orderId), fields)
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, 'orders', id))
}

export async function placeManualOrder(order: Omit<Order, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    timestamp: Date.now(),
    updatedAt: Date.now(),
    status:    'CONFIRMED',
  })
  return ref.id
}

// ── Image upload ──────────────────────────────────────────────────────────────

export async function uploadProductImage(productId: string, file: File): Promise<string> {
  const path    = `products/${productId}/${Date.now()}_${file.name}`
  const storRef = ref(storage, path)
  await uploadBytes(storRef, file)
  return getDownloadURL(storRef)
}

export async function deleteProductImage(url: string) {
  try {
    await deleteObject(ref(storage, url))
  } catch { /* ignore if not found */ }
}
