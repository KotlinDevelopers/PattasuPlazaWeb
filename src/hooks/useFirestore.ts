'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, getDoc, getDocs, addDoc, limit,
  DocumentData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product, Category, Combo, Banner, AppConfig, Order, CartItem } from '@/types'

// ── Products ──────────────────────────────────────────────
export function useProducts(categoryId?: string, maxCount?: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    let q = query(collection(db, 'products'), where('isActive', '==', true))
    if (categoryId) q = query(q, where('categoryId', '==', categoryId))
    if (maxCount)   q = query(q, limit(maxCount))

    const unsub = onSnapshot(q,
      snap => { setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))); setLoading(false) },
      err  => { setError(err.message); setLoading(false) }
    )
    return unsub
  }, [categoryId, maxCount])

  return { products, loading, error }
}

export function useFeaturedProducts(count = 8) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      limit(count)
    )
    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
      setLoading(false)
    })
    return unsub
  }, [count])

  return { products, loading }
}

export function useOfferProducts(count = 8) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('isOffer', '==', true),
      limit(count)
    )
    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
      setLoading(false)
    })
    return unsub
  }, [count])

  return { products, loading }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'products', id),
      snap => {
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product)
        else setError('Product not found')
        setLoading(false)
      },
      err => { setError(err.message); setLoading(false) }
    )
    return unsub
  }, [id])

  return { product, loading, error }
}

// ── Categories ────────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'categories'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    )
    const unsub = onSnapshot(q, snap => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)))
      setLoading(false)
    })
    return unsub
  }, [])

  return { categories, loading }
}

// ── Combos ────────────────────────────────────────────────
export function useCombos(featuredOnly = false) {
  const [combos,  setCombos]  = useState<Combo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = query(collection(db, 'combos'), where('isActive', '==', true))
    if (featuredOnly) q = query(q, where('isFeatured', '==', true))
    const unsub = onSnapshot(q, snap => {
      setCombos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Combo)))
      setLoading(false)
    })
    return unsub
  }, [featuredOnly])

  return { combos, loading }
}

export function useCombo(id: string) {
  const [combo,   setCombo]   = useState<Combo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'combos', id), snap => {
      if (snap.exists()) setCombo({ id: snap.id, ...snap.data() } as Combo)
      setLoading(false)
    })
    return unsub
  }, [id])

  return { combo, loading }
}

// ── Banners ───────────────────────────────────────────────
export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'banners'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    )
    const unsub = onSnapshot(q,
      snap => { setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner))); setLoading(false) },
      err  => { setLoading(false) }
    )
    return unsub
  }, [])

  return { banners, loading }
}

// ── App Config ────────────────────────────────────────────
export function useAppConfig() {
  const [config,  setConfig]  = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'app'), snap => {
      if (snap.exists()) setConfig(snap.data() as AppConfig)
      setLoading(false)
    })
    return unsub
  }, [])

  return { config, loading }
}

// ── Orders ────────────────────────────────────────────────
export function useOrders(mobile: string) {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!mobile || mobile.length < 10) { setOrders([]); return }
    setLoading(true)
    const q = query(
      collection(db, 'orders'),
      where('mobileNumber', '==', mobile),
      orderBy('timestamp', 'desc')
    )
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
      setLoading(false)
    })
    return unsub
  }, [mobile])

  return { orders, loading }
}

export function useOrder(orderId: string) {
  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    const unsub = onSnapshot(doc(db, 'orders', orderId), snap => {
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() } as Order)
      setLoading(false)
    })
    return unsub
  }, [orderId])

  return { order, loading }
}

// ── Submit Order ──────────────────────────────────────────
export async function submitOrder(params: {
  cartItems    : CartItem[]
  customerName : string
  mobileNumber : string
  deliveryArea : string
  notes        : string
  orderType    : string
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const ref = await addDoc(collection(db, 'orders'), {
      customerName : params.customerName,
      mobileNumber : params.mobileNumber,
      deliveryArea : params.deliveryArea,
      notes        : params.notes,
      orderType    : params.orderType,
      status       : 'PENDING',
      timestamp    : Date.now(),
      updatedAt    : Date.now(),
      adminNotes   : '',
      trackingInfo : '',
      estimatedDelivery: '',
      totalAmount  : params.cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
      items        : params.cartItems.map(i => ({
        productId        : i.productId,
        productName      : i.productName,
        productNameTamil : i.productNameTamil,
        variantDesc      : i.variantDesc,
        quantity         : i.quantity,
        price            : i.price,
        tier             : i.tier,
        isCombo          : i.isCombo,
      })),
    })
    return { success: true, orderId: ref.id }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
