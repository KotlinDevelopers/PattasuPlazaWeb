'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useOrders } from '@/hooks/useFirestore'
import { formatINR } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/types'
import type { Order, OrderStatus } from '@/types'

function StatusBadge({ status }: { status: OrderStatus }) {
  const info = ORDER_STATUS_LABELS[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
          style={{ background: info.color + '20', color: info.color, border: `1px solid ${info.color}50` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: info.color }}/>
      {info.en}
    </span>
  )
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = ['PENDING','CONTACTED','CONFIRMED','DISPATCHED','DELIVERED']
  const idx = steps.indexOf(status)
  return (
    <div className="flex items-center gap-0 mt-4">
      {steps.map((s, i) => {
        const done    = i < idx
        const current = i === idx
        const info    = ORDER_STATUS_LABELS[s]
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold transition-all ${
                done    ? 'bg-[#1A7F3E] text-white' :
                current ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/25' :
                'bg-[#E9D9B4] dark:bg-[#2A2015] text-[#BCAAA4]'
              }`}
              style={current ? { background: info.color, boxShadow: `0 0 0 4px ${info.color}30` } : {}}>
                {done ? '✓' : i+1}
              </div>
              <div className={`text-[9px] font-semibold mt-1 tracking-[0.5px] ${current ? 'text-[#FF6B00]' : done ? 'text-[#1A7F3E]' : 'text-[#BCAAA4]'}`}>
                {info.en}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 -mt-4 transition-all ${done || (i < idx) ? 'bg-[#1A7F3E]' : 'bg-[#E9D9B4] dark:bg-[#2A2015]'}`}/>
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <motion.div layout className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E9D9B4] dark:border-[#2A2015] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-[#FAF0DC]/50 dark:hover:bg-[#13100C]/50 transition">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-[15px] text-[#3D2810] dark:text-[#FFF8F0]">
              #{order.id.slice(-8).toUpperCase()}
            </span>
            <StatusBadge status={order.status}/>
          </div>
          <div className="mt-1 text-[13px] text-[#9E7A3A]">
            {new Date(order.timestamp).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
            {' · '}
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            {' · '}
            <span className="font-bold text-[#D14600]">₹{formatINR(order.totalAmount)}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="mt-1 text-[12px] text-[#1A7F3E] font-semibold">
              📦 Est. delivery: {order.estimatedDelivery}
            </div>
          )}
        </div>
        {expanded ? <ChevronUp size={18} className="text-[#9E7A3A] shrink-0 mt-0.5"/> : <ChevronDown size={18} className="text-[#9E7A3A] shrink-0 mt-0.5"/>}
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }}
            transition={{ duration:0.3 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-[#E9D9B4] dark:border-[#2A2015] pt-4 space-y-4">

              {/* Timeline */}
              {!isCancelled && <StatusTimeline status={order.status}/>}

              {/* Items */}
              <div>
                <div className="text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-2">Items</div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[14px]">
                      <div className="flex-1 min-w-0">
                        <span className="text-[#3D2810] dark:text-[#FFF8F0] font-medium">{item.productName}</span>
                        {item.variantDesc && <span className="text-[#9E7A3A] ml-1.5 text-[12px]">({item.variantDesc})</span>}
                        <span className="text-[#9E7A3A] ml-1.5">×{item.quantity}</span>
                      </div>
                      <span className="font-bold text-[#D14600] ml-3">₹{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#E9D9B4] dark:border-[#2A2015] flex justify-between font-extrabold text-[15px]">
                  <span className="text-[#7B4F00] dark:text-[#BCAAA4]">Total</span>
                  <span className="text-[#D14600]">₹{formatINR(order.totalAmount)}</span>
                </div>
              </div>

              {/* Delivery */}
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <div className="text-[10px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1">Delivery Area</div>
                  <div className="text-[#3D2810] dark:text-[#FFF8F0]">{order.deliveryArea}</div>
                </div>
                {order.trackingInfo && (
                  <div>
                    <div className="text-[10px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1">Tracking</div>
                    <div className="text-[#3D2810] dark:text-[#FFF8F0] font-mono">{order.trackingInfo}</div>
                  </div>
                )}
              </div>

              {/* Admin notes */}
              {order.adminNotes && (
                <div className="p-3 rounded-xl bg-[#FF6B00]/8 border border-[#FF6B00]/20">
                  <div className="text-[11px] uppercase tracking-[2px] text-[#FF6B00] font-semibold mb-1">Message from us</div>
                  <div className="text-[13px] text-[#7B4F00] dark:text-[#E8DDC9]">{order.adminNotes}</div>
                </div>
              )}

              {/* WhatsApp follow up */}
              <a href={`https://wa.me/919876543210?text=Hi! I'd like to enquire about order #${order.id.slice(-8).toUpperCase()}`}
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#1A7F3E] dark:text-[#9CE6B0] text-[13px] font-semibold hover:bg-[#25D366]/25 transition">
                <MessageCircle size={14}/> Follow up on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function OrdersPage() {
  const [mobile,    setMobile]    = useState('')
  const [searched,  setSearched]  = useState('')
  const { orders, loading }       = useOrders(searched)

  const handleSearch = () => {
    if (mobile.trim().length >= 10) setSearched(mobile.trim())
  }

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">

        {/* Header strip */}
        <div className="bg-[#0A0A0A] py-14 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-[11px] tracking-[3px] uppercase font-semibold text-[#FF6B00] mb-3">Order History</div>
            <h1 className="text-[#FFD700] font-extrabold text-[42px] leading-tight"
                style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
              My Orders
            </h1>
            <p className="text-[#BCAAA4] text-[15px] mt-2">Enter your mobile number to track all your orders</p>
          </div>
        </div>

        <div className="max-w-[800px] mx-auto px-5 md:px-8 py-10">

          {/* Mobile search */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015] mb-8">
            <label className="block text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-2">
              Mobile Number
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E7A3A] text-[14px]">+91</span>
                <input
                  type="tel" value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/,'').slice(0,10))}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-[#FFFDF7] dark:bg-[#0F0907] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"/>
              </div>
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#D14600] text-white font-bold text-[14px] transition shadow-[0_6px_20px_rgba(255,107,0,0.35)]">
                <Search size={16}/> Track
              </button>
            </div>
          </div>

          {/* Results */}
          {loading && searched && (
            <div className="space-y-4">
              {[1,2].map(i => (
                <div key={i} className="rounded-2xl p-5 bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015]">
                  <div className="skeleton h-5 w-48 mb-2"/>
                  <div className="skeleton h-4 w-72"/>
                </div>
              ))}
            </div>
          )}

          {!loading && searched && orders.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-[#E9D9B4] dark:text-[#2A2015] mb-4"/>
              <h3 className="text-[18px] font-bold text-[#7B4F00] dark:text-[#BCAAA4] mb-2">No orders found</h3>
              <p className="text-[14px] text-[#9E7A3A]">No orders found for +91 {searched}</p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <motion.div layout className="space-y-4">
              <p className="text-[13px] text-[#9E7A3A] mb-4">
                {orders.length} order{orders.length !== 1 ? 's' : ''} found for +91 {searched}
              </p>
              {orders.map(order => <OrderCard key={order.id} order={order}/>)}
            </motion.div>
          )}

          {!searched && (
            <div className="text-center py-8 text-[#BCAAA4]">
              <Package size={40} className="mx-auto mb-3 opacity-40"/>
              <p className="text-[14px]">Enter your mobile number above to view your orders</p>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}
