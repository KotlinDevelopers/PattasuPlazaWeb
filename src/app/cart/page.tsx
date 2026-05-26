'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link   from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import { Firework } from '@/components/shared/Firework'
import { useCartStore } from '@/lib/store'
import { submitOrder }  from '@/hooks/useFirestore'
import { formatINR, buildWhatsAppOrderLink, isMinOrderMet } from '@/lib/utils'
import { MIN_ORDER, WHATSAPP_NUMBER } from '@/lib/brand'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, subtotal, totalQty } = useCartStore()
  const router = useRouter()
  const sub    = subtotal()
  const qty    = totalQty()
  const metMin = isMinOrderMet(sub)

  const [showForm,  setShowForm]  = useState(false)
  const [submitting,setSubmitting]= useState(false)
  const [success,   setSuccess]   = useState(false)
  const [orderId,   setOrderId]   = useState('')

  const [form, setForm] = useState({ name:'', mobile:'', area:'', notes:'' })
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.mobile.trim() || form.mobile.length < 10) {
      toast.error('Please fill name and valid mobile number')
      return
    }
    if (!form.area.trim()) { toast.error('Please enter delivery area'); return }
    setSubmitting(true)
    const r = await submitOrder({
      cartItems: items, customerName: form.name,
      mobileNumber: form.mobile, deliveryArea: form.area,
      notes: form.notes, orderType: useCartStore.getState().dominantTier(),
    })
    setSubmitting(false)
    if (r.success) {
      clearCart()
      router.push(`/order-success?id=${r.orderId}&mobile=${form.mobile}`)
    } else {
      toast.error('Order failed. Please try WhatsApp instead.')
    }
  }

  const whatsappLink = buildWhatsAppOrderLink(
    items.map(i => ({ name: i.productName + (i.variantDesc ? ` (${i.variantDesc})` : ''), qty: i.quantity, price: i.price }))
  )



  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8">

          <h1 className="text-[32px] font-extrabold text-[#3D2810] dark:text-[#FFD700] mb-8"
              style={{ fontFamily:'"Playfair Display", serif' }}>
            Your Cart {qty > 0 && <span className="text-[22px] text-[#9E7A3A] font-normal">({qty} items)</span>}
          </h1>

          {items.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
              <div className="mx-auto w-48 h-48 opacity-30 mb-6">
                <Firework size={192} variant="gold"/>
              </div>
              <h2 className="text-[24px] font-extrabold text-[#7B4F00] dark:text-[#FFD700] mb-3">Cart is empty</h2>
              <p className="text-[#9E7A3A] mb-8">Add some sparkle to your cart!</p>
              <Link href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white font-bold text-[15px] shadow-[0_10px_30px_rgba(255,107,0,0.45)] hover:-translate-y-0.5 transition-all">
                <ShoppingBag size={18}/> Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Items list */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <motion.div
                      key={item.productId + item.variantId}
                      layout
                      initial={{ opacity:0, x:-20 }}
                      animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:20, height:0 }}
                      transition={{ duration:0.3 }}
                      className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 md:p-5 border border-[#E9D9B4] dark:border-[#2A2015] flex items-start gap-4">

                      {/* Product visual */}
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#FFF1C5] to-[#FFE08A] grid place-items-center shrink-0 overflow-hidden">
                        <Firework size={60} variant={item.isCombo ? 'rose' : 'gold'}/>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[15px] text-[#3D2810] dark:text-[#FFF8F0] line-clamp-1">{item.productName}</div>
                        {item.productNameTamil && (
                          <div className="text-[12px] text-[#9E7A3A] mt-0.5" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                            {item.productNameTamil}
                          </div>
                        )}
                        {item.variantDesc && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FF6B00]/10 text-[#D14600] text-[11px] font-semibold">
                            {item.variantDesc}
                          </span>
                        )}
                        <div className="mt-2 flex items-center gap-3 flex-wrap">
                          <span className="text-[18px] font-extrabold text-[#D14600]">₹{formatINR(item.price)}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700]/15 text-[#7B4F00]">
                            {item.tier} pricing
                          </span>
                        </div>
                      </div>

                      {/* Qty + delete */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="p-1.5 rounded-lg text-[#9E7A3A] hover:text-[#D14600] hover:bg-[#D14600]/10 transition">
                          <Trash2 size={15}/>
                        </button>
                        <div className="inline-flex items-center rounded-xl overflow-hidden border border-[#E9D9B4] dark:border-[#2A2015]">
                          <button
                            onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#7B4F00] dark:text-[#BCAAA4] transition">
                            <Minus size={13}/>
                          </button>
                          <span className="w-10 text-center font-bold text-[14px] text-[#3D2810] dark:text-[#FFF8F0]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#7B4F00] dark:text-[#BCAAA4] transition">
                            <Plus size={13}/>
                          </button>
                        </div>
                        <div className="text-[13px] font-bold text-[#7B4F00] dark:text-[#BCAAA4]">
                          ₹{formatINR(item.price * item.quantity)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
                  <h2 className="text-[18px] font-bold text-[#3D2810] dark:text-[#FFF8F0] mb-4">Order Summary</h2>

                  <div className="space-y-2 text-[14px] mb-4">
                    <div className="flex justify-between text-[#7B4F00] dark:text-[#BCAAA4]">
                      <span>Subtotal ({qty} items)</span>
                      <span>₹{formatINR(sub)}</span>
                    </div>
                    <div className="flex justify-between text-[#7B4F00] dark:text-[#BCAAA4]">
                      <span>Delivery</span>
                      <span className="text-[#1A7F3E] font-semibold">Calculated on order</span>
                    </div>
                  </div>

                  <div className="border-t border-[#E9D9B4] dark:border-[#2A2015] pt-3 mb-4">
                    <div className="flex justify-between text-[18px] font-extrabold text-[#3D2810] dark:text-[#FFF8F0]">
                      <span>Total</span>
                      <span className="text-[#D14600]">₹{formatINR(sub)}</span>
                    </div>
                  </div>

                  {/* Min order warning */}
                  {!metMin && (
                    <div className="mb-4 p-3 rounded-xl bg-[#FFF3CD] border border-[#FFD700]/40 text-[12px] text-[#7B4F00]">
                      ⚠️ Minimum order ₹{formatINR(MIN_ORDER)}. Add ₹{formatINR(MIN_ORDER - sub)} more to proceed.
                    </div>
                  )}

                  {/* Order form */}
                  <AnimatePresence>
                    {showForm && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:'auto', opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        className="overflow-hidden mb-4 space-y-3">
                        {[
                          { k:'name',   label:'Your Name *',        type:'text',  ph:'Full name' },
                          { k:'mobile', label:'Mobile Number *',     type:'tel',   ph:'+91 98765 43210' },
                          { k:'area',   label:'Delivery Area *',     type:'text',  ph:'City / District' },
                        ].map(f => (
                          <div key={f.k}>
                            <label className="block text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1">{f.label}</label>
                            <input type={f.type} placeholder={f.ph}
                              value={(form as any)[f.k]}
                              onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-[#FFFDF7] dark:bg-[#0F0907] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"/>
                          </div>
                        ))}
                        <div>
                          <label className="block text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1">Notes (optional)</label>
                          <textarea placeholder="Special instructions, delivery preferences…"
                            value={form.notes}
                            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                            rows={2}
                            className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-[#FFFDF7] dark:bg-[#0F0907] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] transition resize-none"/>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Place order */}
                  {!showForm ? (
                    <button
                      onClick={() => setShowForm(true)}
                      disabled={!metMin}
                      className={`w-full py-3.5 rounded-xl font-bold text-[15px] transition-all ${
                        metMin
                          ? 'bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white shadow-[0_8px_24px_rgba(255,107,0,0.40)] hover:shadow-[0_12px_32px_rgba(255,107,0,0.55)] hover:-translate-y-0.5'
                          : 'bg-[#E9D9B4] text-[#BCAAA4] cursor-not-allowed'
                      }`}>
                      Place Order
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl font-bold text-[15px] bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white shadow-[0_8px_24px_rgba(255,107,0,0.40)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      {submitting
                        ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Placing…</>
                        : 'Confirm Order'
                      }
                    </button>
                  )}

                  <div className="mt-3 text-center text-[12px] text-[#9E7A3A]">or</div>

                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                     className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#1FB958] text-white font-bold text-[14px] transition-all shadow-[0_6px_18px_rgba(37,211,102,0.35)]">
                    <MessageCircle size={17}/> Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}
