'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Minus, Trash2, MessageCircle, Send, Package, X } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Firework } from '@/components/shared/Firework'
import { SkeletonCard } from '@/components/home/HomeSections'
import { useProducts, useCategories, submitOrder } from '@/hooks/useFirestore'
import { useCartStore } from '@/lib/store'
import { formatINR, buildWhatsAppOrderLink, isMinOrderMet } from '@/lib/utils'
import { MIN_ORDER } from '@/lib/brand'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface BulkItem { product: Product; quantity: number }

export default function BulkOrderPage() {
  const { products, loading }  = useProducts()
  const { categories }         = useCategories()
  const [search,    setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([])
  const [step,      setStep]   = useState<'select'|'form'>('select')
  const [submitting,setSubmitting] = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [orderId,   setOrderId]   = useState('')
  const [form,      setForm]   = useState({ name:'', mobile:'', area:'', notes:'' })

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const filtered = useMemo(() => {
    let r = [...products]
    if (search)    r = r.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (catFilter) r = r.filter(p => p.categoryId === catFilter)
    return r
  }, [products, search, catFilter])

  const addToList = (product: Product) => {
    setBulkItems(prev => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + (product.bulkMinQty || 1) } : i)
      return [...prev, { product, quantity: product.bulkMinQty || 1 }]
    })
    toast.success(`${product.name} added!`, { duration: 1500 })
  }

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) setBulkItems(prev => prev.filter(i => i.product.id !== productId))
    else setBulkItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i))
  }

  const totalAmount  = bulkItems.reduce((s, i) => s + i.product.bulkPrice * i.quantity, 0)
  const totalRetail  = bulkItems.reduce((s, i) => s + i.product.retailPrice * i.quantity, 0)
  const totalSavings = totalRetail - totalAmount
  const metMin       = isMinOrderMet(totalAmount)

  const whatsappItems = bulkItems.map(i => ({
    name: `${i.product.name} (Bulk ×${i.quantity})`,
    qty: 1, price: i.product.bulkPrice * i.quantity,
  }))

  const handleSubmit = async () => {
    if (!form.name || !form.mobile || form.mobile.length < 10 || !form.area) {
      toast.error('Please fill all required fields'); return
    }
    setSubmitting(true)
    const cartItems = bulkItems.map(i => ({
      productId: i.product.id, productName: i.product.name,
      productNameTamil: i.product.nameTamil, variantId: '',
      variantDesc: `Bulk × ${i.quantity}`, price: i.product.bulkPrice,
      tier: 'BULK' as any, quantity: i.quantity,
      stockCount: i.product.stockCount, isCombo: false,
    }))
    const r = await submitOrder({
      cartItems, customerName: form.name, mobileNumber: form.mobile,
      deliveryArea: form.area, notes: `BULK ORDER. ${form.notes}`, orderType: 'BULK',
    })
    setSubmitting(false)
    if (r.success) { setOrderId(r.orderId!); setSuccess(true) }
    else toast.error('Failed to submit. Please use WhatsApp.')
  }

  if (success) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px] flex items-center justify-center px-5">
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-[500px] py-16">
          <div className="text-7xl mb-6">🎆</div>
          <h1 className="text-[32px] font-extrabold text-[#7B4F00] dark:text-[#FFD700] mb-3"
              style={{ fontFamily:'"Playfair Display", serif' }}>Bulk Order Placed!</h1>
          <p className="text-[15px] text-[#9E7A3A] mb-2">
            Order <span className="font-bold text-[#FF6B00]">#{orderId.slice(-8).toUpperCase()}</span> confirmed.
          </p>
          <p className="text-[14px] text-[#9E7A3A] mb-8">
            Our bulk team will call you on <strong>{form.mobile}</strong> within 2 hours to finalise quantities and delivery.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/orders" className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold hover:bg-[#D14600] transition">
              Track Order
            </Link>
            <Link href="/shop" className="px-6 py-3 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4] font-bold hover:border-[#FF6B00]/50 transition">
              Back to Shop
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer/>
    </>
  )

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">

        {/* Hero */}
        <div className="relative bg-[#0A0A0A] py-14 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <Firework size={200} variant="gold"/>
          </div>
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-[11px] tracking-[3px] uppercase font-semibold text-[#FF6B00] mb-3">
              Min order ₹{formatINR(MIN_ORDER)} · Bulk prices apply
            </div>
            <h1 className="text-[#FFD700] font-extrabold text-[42px] md:text-[56px] leading-tight"
                style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
              Bulk Order
            </h1>
            <p className="text-[#BCAAA4] text-[15px] mt-2 max-w-[500px]">
              Best prices for large quantities. Dealers, event organizers, and wholesale buyers — this is your page.
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Product selector */}
            <div className="lg:col-span-2">
              <h2 className="text-[20px] font-bold text-[#3D2810] dark:text-[#FFD700] mb-4"
                  style={{ fontFamily:'"Playfair Display", serif' }}>
                Select Products
              </h2>

              {/* Search + filter */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E7A3A]" size={15}/>
                  <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#9E7A3A] focus:outline-none focus:border-[#FF6B00] transition"/>
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[13px] text-[#3D2810] dark:text-[#FFF8F0] focus:outline-none focus:border-[#FF6B00] transition">
                  <option value="">All categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Products grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i}/>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-1">
                  {filtered.map(product => {
                    const inList  = bulkItems.find(i => i.product.id === product.id)
                    const savings = ((product.retailPrice - product.bulkPrice) / product.retailPrice * 100).toFixed(0)
                    return (
                      <div key={product.id}
                        className={`bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 border transition-all ${
                          inList ? 'border-[#FF6B00] shadow-[0_4px_16px_rgba(255,107,0,0.20)]' : 'border-[#E9D9B4] dark:border-[#2A2015] hover:border-[#FF6B00]/40'
                        }`}>
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFF1C5] to-[#FFE08A] grid place-items-center shrink-0">
                            <Firework size={44} variant="gold"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[13px] text-[#3D2810] dark:text-[#FFF8F0] line-clamp-1">{product.name}</div>
                            {product.nameTamil && (
                              <div className="text-[11px] text-[#9E7A3A] line-clamp-1" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                                {product.nameTamil}
                              </div>
                            )}
                            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                              <span className="text-[16px] font-extrabold text-[#D14600]">₹{formatINR(product.bulkPrice)}</span>
                              <span className="text-[11px] text-[#9E7A3A] line-through">₹{formatINR(product.retailPrice)}</span>
                              <span className="text-[10px] font-bold text-[#1A7F3E] bg-[#E8F8EE] dark:bg-[#0E2A1A] px-1.5 py-0.5 rounded-full">
                                -{savings}%
                              </span>
                            </div>
                            <div className="text-[10px] text-[#9E7A3A] mt-0.5">
                              Min: {product.bulkMinQty || 20} pcs · Unit: {product.unit || 'piece'}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => addToList(product)}
                          className={`mt-3 w-full py-2 rounded-xl text-[13px] font-semibold transition-all ${
                            inList
                              ? 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30'
                              : 'bg-[#FF6B00] text-white hover:bg-[#D14600]'
                          }`}>
                          {inList ? `✓ Added (×${inList.quantity})` : '+ Add to Bulk Order'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E9D9B4] dark:border-[#2A2015] overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-[#E9D9B4] dark:border-[#2A2015] flex items-center justify-between">
                    <h3 className="text-[17px] font-bold text-[#3D2810] dark:text-[#FFF8F0]">
                      Bulk Order List
                    </h3>
                    <span className="text-[12px] font-semibold text-[#9E7A3A]">
                      {bulkItems.length} products
                    </span>
                  </div>

                  {bulkItems.length === 0 ? (
                    <div className="p-8 text-center">
                      <Package size={36} className="mx-auto text-[#E9D9B4] dark:text-[#2A2015] mb-3"/>
                      <p className="text-[14px] text-[#9E7A3A]">Add products to start your bulk order</p>
                    </div>
                  ) : (
                    <>
                      {/* Items */}
                      <div className="max-h-[300px] overflow-y-auto">
                        {bulkItems.map(item => (
                          <div key={item.product.id} className="p-4 border-b border-[#E9D9B4] dark:border-[#2A2015] last:border-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="text-[13px] font-semibold text-[#3D2810] dark:text-[#FFF8F0] flex-1 line-clamp-1">
                                {item.product.name}
                              </div>
                              <button onClick={() => updateQty(item.product.id, 0)}
                                className="text-[#9E7A3A] hover:text-[#D14600] transition shrink-0">
                                <Trash2 size={13}/>
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="inline-flex items-center rounded-lg overflow-hidden border border-[#E9D9B4] dark:border-[#2A2015]">
                                <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#7B4F00] dark:text-[#BCAAA4] transition">
                                  <Minus size={12}/>
                                </button>
                                <span className="w-10 text-center text-[13px] font-bold text-[#3D2810] dark:text-[#FFF8F0]">
                                  {item.quantity}
                                </span>
                                <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#7B4F00] dark:text-[#BCAAA4] transition">
                                  <Plus size={12}/>
                                </button>
                              </div>
                              <span className="text-[14px] font-extrabold text-[#D14600]">
                                ₹{formatINR(item.product.bulkPrice * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="p-4 bg-[#FAF0DC] dark:bg-[#13100C] space-y-2 text-[13px]">
                        <div className="flex justify-between text-[#7B4F00] dark:text-[#BCAAA4]">
                          <span>Retail value</span>
                          <span>₹{formatINR(totalRetail)}</span>
                        </div>
                        <div className="flex justify-between text-[#1A7F3E] font-semibold">
                          <span>Bulk savings</span>
                          <span>-₹{formatINR(totalSavings)}</span>
                        </div>
                        <div className="flex justify-between text-[17px] font-extrabold text-[#3D2810] dark:text-[#FFF8F0] border-t border-[#E9D9B4] dark:border-[#2A2015] pt-2 mt-1">
                          <span>Total (Bulk)</span>
                          <span className="text-[#D14600]">₹{formatINR(totalAmount)}</span>
                        </div>
                        {!metMin && (
                          <div className="text-[11px] text-[#FF9800] bg-[#FFF3CD] dark:bg-[#2A1E00] rounded-lg px-2 py-1.5 mt-1">
                            ⚠ Add ₹{formatINR(MIN_ORDER - totalAmount)} more to reach minimum order
                          </div>
                        )}
                      </div>

                      {/* Form */}
                      <AnimatePresence>
                        {step === 'form' && (
                          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                            exit={{ height:0, opacity:0 }} className="overflow-hidden">
                            <div className="p-4 space-y-3 border-t border-[#E9D9B4] dark:border-[#2A2015]">
                              {[
                                { k:'name',   label:'Name *',           type:'text', ph:'Your full name'    },
                                { k:'mobile', label:'Mobile *',          type:'tel',  ph:'+91 98765 43210'  },
                                { k:'area',   label:'Delivery Area *',   type:'text', ph:'City / District'  },
                              ].map(fi => (
                                <div key={fi.k}>
                                  <label className="block text-[10px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1">{fi.label}</label>
                                  <input type={fi.type} value={(form as any)[fi.k]} onChange={f(fi.k)}
                                    placeholder={fi.ph}
                                    className="w-full px-3 py-2 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-white dark:bg-[#0F0907] text-[13px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"/>
                                </div>
                              ))}
                              <div>
                                <label className="block text-[10px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1">Notes</label>
                                <textarea value={form.notes} onChange={f('notes')} rows={2} placeholder="Delivery notes, special requirements…"
                                  className="w-full px-3 py-2 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-white dark:bg-[#0F0907] text-[13px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] transition resize-none"/>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action buttons */}
                      <div className="p-4 space-y-2 border-t border-[#E9D9B4] dark:border-[#2A2015]">
                        {step === 'select' ? (
                          <button onClick={() => setStep('form')} disabled={!metMin}
                            className={`w-full py-3 rounded-xl font-bold text-[14px] transition-all ${
                              metMin ? 'bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.35)] hover:-translate-y-0.5'
                                : 'bg-[#E9D9B4] dark:bg-[#2A2015] text-[#BCAAA4] cursor-not-allowed'
                            }`}>
                            Proceed to Order Details
                          </button>
                        ) : (
                          <button onClick={handleSubmit} disabled={submitting}
                            className="w-full py-3 rounded-xl font-bold text-[14px] bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                            {submitting
                              ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Submitting…</>
                              : <><Send size={15}/> Submit Bulk Order</>
                            }
                          </button>
                        )}
                        <a href={buildWhatsAppOrderLink(whatsappItems)} target="_blank" rel="noopener noreferrer"
                           className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1FB958] text-white font-bold text-[13px] transition">
                          <MessageCircle size={15}/> Send via WhatsApp
                        </a>
                        {step === 'form' && (
                          <button onClick={() => setStep('select')} className="w-full text-[12px] text-[#9E7A3A] hover:text-[#FF6B00] transition">
                            ← Back to product selection
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
