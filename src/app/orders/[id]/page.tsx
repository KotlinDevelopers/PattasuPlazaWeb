'use client'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useOrder } from '@/hooks/useFirestore'
import { formatINR } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/types'
import type { OrderStatus } from '@/types'
import { MessageCircle, ArrowLeft } from 'lucide-react'

const STEPS: OrderStatus[] = ['PENDING','CONTACTED','CONFIRMED','DISPATCHED','DELIVERED']

export default function OrderDetailPage() {
  const { id }              = useParams() as { id: string }
  const { order, loading }  = useOrder(id)

  if (loading) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF6B00]/30 border-t-[#FF6B00] animate-spin"/>
      </main>
      <Footer/>
    </>
  )

  if (!order) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-[22px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-4">Order not found</h2>
          <Link href="/orders" className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold">Back to Orders</Link>
        </div>
      </main>
      <Footer/>
    </>
  )

  const statusInfo = ORDER_STATUS_LABELS[order.status]
  const stepIdx    = STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
        <div className="max-w-[800px] mx-auto px-5 md:px-8 py-8">

          {/* Back */}
          <Link href="/orders" className="inline-flex items-center gap-2 text-[13px] text-[#9E7A3A] hover:text-[#FF6B00] mb-6 transition-colors">
            <ArrowLeft size={14}/> Back to My Orders
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h1 className="text-[28px] font-extrabold text-[#3D2810] dark:text-[#FFD700]"
                  style={{ fontFamily:'"Playfair Display", serif' }}>
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-[13px] text-[#9E7A3A] mt-1">
                Placed {new Date(order.timestamp).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold"
              style={{ background: statusInfo.color + '20', color: statusInfo.color, border: `1px solid ${statusInfo.color}40` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: statusInfo.color }}/>
              {statusInfo.en} · {statusInfo.ta}
            </span>
          </div>

          <div className="space-y-5">
            {/* Timeline */}
            {!isCancelled && (
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
                <h2 className="text-[15px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-5">Order Progress</h2>
                <div className="flex items-start justify-between">
                  {STEPS.map((s, i) => {
                    const done    = i < stepIdx
                    const current = i === stepIdx
                    const info    = ORDER_STATUS_LABELS[s]
                    return (
                      <div key={s} className="flex flex-col items-center flex-1">
                        <div className="relative flex items-center justify-center w-full">
                          {i > 0 && (
                            <div className={`absolute right-1/2 top-4 left-0 h-0.5 ${done || current ? '' : 'opacity-30'}`}
                                 style={{ background: done ? info.color : '#E9D9B4' }}/>
                          )}
                          <div className={`relative z-10 w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold transition-all ${
                            done    ? 'bg-[#1A7F3E] text-white' :
                            current ? 'text-white ring-4 ring-offset-2 dark:ring-offset-[#1A1A1A]' :
                            'bg-[#E9D9B4] dark:bg-[#2A2015] text-[#BCAAA4]'
                          }`}
                          style={current ? { background: info.color, boxShadow:`0 0 0 4px ${info.color}30` } : {}}>
                            {done ? '✓' : i+1}
                          </div>
                        </div>
                        <div className={`text-[9px] font-semibold mt-2 text-center ${
                          current ? 'text-[#FF6B00]' : done ? 'text-[#1A7F3E]' : 'text-[#BCAAA4]'
                        }`}>{info.en}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
              <h2 className="text-[15px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-4">Items Ordered ({order.items.length})</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#E9D9B4] dark:border-[#2A2015] last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[#3D2810] dark:text-[#FFF8F0]">{item.productName}</div>
                      {item.variantDesc && <div className="text-[12px] text-[#9E7A3A]">{item.variantDesc}</div>}
                      <div className="text-[12px] text-[#9E7A3A]">
                        ₹{formatINR(item.price)} × {item.quantity} · {item.tier} pricing
                      </div>
                    </div>
                    <div className="text-[15px] font-extrabold text-[#D14600] ml-4">
                      ₹{formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[17px] font-extrabold pt-1">
                  <span className="text-[#3D2810] dark:text-[#FFF8F0]">Total</span>
                  <span className="text-[#D14600]">₹{formatINR(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
                <h3 className="text-[12px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-3">Delivery Details</h3>
                <div className="space-y-1.5 text-[13px]">
                  <div><span className="text-[#9E7A3A]">Name:</span> <span className="font-semibold text-[#3D2810] dark:text-[#FFF8F0]">{order.customerName}</span></div>
                  <div><span className="text-[#9E7A3A]">Mobile:</span> <span className="font-semibold text-[#3D2810] dark:text-[#FFF8F0]">{order.mobileNumber}</span></div>
                  <div><span className="text-[#9E7A3A]">Area:</span> <span className="font-semibold text-[#3D2810] dark:text-[#FFF8F0]">{order.deliveryArea}</span></div>
                  {order.estimatedDelivery && (
                    <div><span className="text-[#9E7A3A]">Est. Delivery:</span> <span className="font-semibold text-[#1A7F3E]">{order.estimatedDelivery}</span></div>
                  )}
                  {order.trackingInfo && (
                    <div><span className="text-[#9E7A3A]">Tracking:</span> <span className="font-semibold font-mono text-[#3D2810] dark:text-[#FFF8F0]">{order.trackingInfo}</span></div>
                  )}
                </div>
              </div>

              {order.adminNotes && (
                <div className="bg-[#FF6B00]/8 dark:bg-[#FF6B00]/12 rounded-2xl p-5 border border-[#FF6B00]/20">
                  <h3 className="text-[12px] uppercase tracking-[2px] text-[#FF6B00] font-semibold mb-3">Message from us</h3>
                  <p className="text-[13px] text-[#7B4F00] dark:text-[#E8DDC9] leading-relaxed">{order.adminNotes}</p>
                </div>
              )}
            </div>

            {/* WhatsApp follow-up */}
            <a href={`https://wa.me/919876543210?text=Hi! Enquiry about order #${order.id.slice(-8).toUpperCase()}`}
               target="_blank" rel="noopener noreferrer"
               className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1FB958] text-white font-bold text-[14px] transition shadow-[0_6px_18px_rgba(37,211,102,0.30)]">
              <MessageCircle size={18}/> Follow up on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
