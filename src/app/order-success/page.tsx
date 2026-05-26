'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Firework, Sparkles } from '@/components/shared/Firework'
import { useOrder } from '@/hooks/useFirestore'
import { formatINR } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/types'
import { ArrowRight, Package, MessageCircle } from 'lucide-react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId      = searchParams.get('id') || ''
  const mobile       = searchParams.get('mobile') || ''
  const { order, loading } = useOrder(orderId)

  return (
    <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
      <div className="max-w-[700px] mx-auto px-5 md:px-8 py-12">
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5 }} className="text-center mb-10">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
            transition={{ delay:0.2, type:'spring', bounce:0.4 }}
            className="relative inline-block mb-6">
            <Sparkles count={20} seed={3}/>
            <div className="text-8xl">🎆</div>
          </motion.div>
          <h1 className="text-[36px] font-extrabold text-[#7B4F00] dark:text-[#FFD700] mb-3"
              style={{ fontFamily:'"Playfair Display", serif' }}>
            Order Placed!
          </h1>
          <p className="text-[16px] text-[#9E7A3A]">
            Thank you! Your Diwali crackers are on their way from Sivakasi 🎇
          </p>
          {orderId && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
              <span className="text-[12px] font-semibold text-[#9E7A3A]">Order ID:</span>
              <span className="text-[14px] font-extrabold text-[#FF6B00]">#{orderId.slice(-8).toUpperCase()}</span>
            </div>
          )}
        </motion.div>

        {/* Order details */}
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-6 w-full rounded"/>
            <div className="skeleton h-32 w-full rounded-2xl"/>
          </div>
        ) : order && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3 }} className="space-y-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-[#3D2810] dark:text-[#FFD700]">Order Summary</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{
                    background: ORDER_STATUS_LABELS[order.status].color + '20',
                    color: ORDER_STATUS_LABELS[order.status].color,
                  }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ORDER_STATUS_LABELS[order.status].color }}/>
                  {ORDER_STATUS_LABELS[order.status].en}
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[14px]">
                    <span className="text-[#7B4F00] dark:text-[#BCAAA4]">
                      {item.productName} {item.variantDesc && `(${item.variantDesc})`} ×{item.quantity}
                    </span>
                    <span className="font-semibold text-[#3D2810] dark:text-[#FFF8F0]">
                      ₹{formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-[16px] font-extrabold border-t border-[#E9D9B4] dark:border-[#2A2015] pt-2 mt-1">
                  <span className="text-[#3D2810] dark:text-[#FFF8F0]">Total</span>
                  <span className="text-[#D14600]">₹{formatINR(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
              <h3 className="text-[14px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-3">What happens next?</h3>
              <div className="space-y-3">
                {[
                  { icon:'📞', step:'We call you', desc:`Our team will call ${order.mobileNumber} within 30 minutes to confirm your order.` },
                  { icon:'📦', step:'We pack',     desc:'Your crackers are carefully packed as per government safety regulations.'           },
                  { icon:'🚚', step:'We deliver',  desc:'Expect delivery in 4–7 business days to your location.'                           },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold text-[#3D2810] dark:text-[#FFF8F0]">{s.step}</div>
                      <div className="text-[12px] text-[#9E7A3A]">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href={`/orders?mobile=${mobile}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FF6B00] text-white font-bold text-[14px] hover:bg-[#D14600] transition">
            Track Order <ArrowRight size={16}/>
          </Link>
          <a href={`https://wa.me/919876543210?text=Hi! My order ID is #${orderId.slice(-8).toUpperCase()}`}
             target="_blank" rel="noopener noreferrer"
             className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1FB958] text-white font-bold text-[14px] transition">
            <MessageCircle size={16}/> WhatsApp Us
          </a>
          <Link href="/shop"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4] font-bold text-[14px] hover:border-[#FF6B00]/50 transition">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar/>
      <Suspense fallback={<div className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]"/>}>
        <OrderSuccessContent/>
      </Suspense>
      <Footer/>
    </>
  )
}
