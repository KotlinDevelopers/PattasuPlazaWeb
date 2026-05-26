'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, ShoppingCart, Check, MessageCircle, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Firework } from '@/components/shared/Firework'
import { useCombo, useProducts } from '@/hooks/useFirestore'
import { useCartStore } from '@/lib/store'
import { formatINR, buildWhatsAppOrderLink } from '@/lib/utils'

export default function ComboDetailPage() {
  const params  = useParams()
  const id      = params.id as string
  const addItem = useCartStore(s => s.addItem)

  const { combo, loading }       = useCombo(id)
  const { products }             = useProducts()

  const [qty,   setQty]   = useState(1)
  const [tier,  setTier]  = useState<'retail'|'wholesale'|'bulk'>('retail')
  const [added, setAdded] = useState(false)

  if (loading) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#0A0A0A] pt-[72px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF6B00]/30 border-t-[#FF6B00] animate-spin"/>
      </main>
      <Footer/>
    </>
  )

  if (!combo) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#0A0A0A] pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-[24px] font-bold text-[#FFD700] mb-4">Combo not found</h2>
          <Link href="/combos" className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold">Back to Combos</Link>
        </div>
      </main>
      <Footer/>
    </>
  )

  const price = tier === 'bulk' ? combo.bulkPrice : tier === 'wholesale' ? combo.wholesalePrice : combo.retailPrice

  const handleAdd = () => {
    addItem({
      productId: combo.id, productName: combo.name,
      productNameTamil: combo.nameTamil, variantId: '',
      variantDesc: `Combo · ${combo.items?.length || 0} items`,
      price, tier: tier.toUpperCase() as any,
      quantity: qty, stockCount: 999, isCombo: true,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const comboProducts = combo.items?.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId),
  })) || []

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#0A0A0A] pt-[72px]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8">

          <nav className="flex items-center gap-2 text-[13px] text-[#BCAAA4] mb-6">
            <Link href="/"       className="hover:text-[#FFD700] transition-colors">Home</Link><span>/</span>
            <Link href="/combos" className="hover:text-[#FFD700] transition-colors">Combos</Link><span>/</span>
            <span className="text-[#FFD700] font-medium line-clamp-1">{combo.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Visual */}
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
              <div className="relative aspect-square rounded-3xl overflow-hidden grid place-items-center"
                   style={{ background:'linear-gradient(155deg, #2A1200 0%, #5B2306 50%, #8B0000 100%)' }}>
                {combo.isFeatured && (
                  <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-[#FFD700] text-[#3D2810] text-[11px] font-bold z-10">
                    ⭐ Most Popular
                  </span>
                )}
                {combo.tag && (
                  <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/15 text-white text-[11px] font-bold z-10">
                    {combo.tag}
                  </span>
                )}
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background:'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)' }}/>
                <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>
                  <Firework size={300} variant="gold"/>
                </motion.div>
              </div>

              {/* Items list */}
              <div className="mt-5 bg-[#1A1A1A] rounded-2xl p-5 border border-[#FFD700]/15">
                <div className="text-[11px] tracking-[2px] uppercase text-[#FF6B00] font-semibold mb-4">
                  What's inside ({combo.items?.length || 0} items)
                </div>
                <div className="space-y-3">
                  {comboProducts.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#FFD700]/8 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0F0907] grid place-items-center shrink-0">
                          <Firework size={24} variant="gold"/>
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#FFF8F0]">
                            {item.product?.name || item.name || item.productId}
                          </div>
                          {item.product?.nameTamil && (
                            <div className="text-[11px] text-[#BCAAA4]" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                              {item.product.nameTamil}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-[#FFD700]">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:0.1 }} className="flex flex-col gap-5">

              <div>
                <div className="text-[11px] tracking-[2px] uppercase font-semibold text-[#FF6B00]">Combo Pack</div>
                <h1 className="text-[32px] md:text-[38px] font-extrabold leading-tight text-[#FFD700] mt-1"
                    style={{ fontFamily:'"Playfair Display", serif' }}>
                  {combo.name}
                </h1>
                {combo.nameTamil && (
                  <div className="mt-1 text-[16px] text-[#BCAAA4]" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                    {combo.nameTamil}
                  </div>
                )}
              </div>

              {combo.description && (
                <p className="text-[15px] text-[#BCAAA4] leading-relaxed">{combo.description}</p>
              )}

              {/* Pricing tiers */}
              <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#FFD700]/15">
                <div className="text-[11px] tracking-[2px] uppercase text-[#BCAAA4] font-semibold mb-3">Choose Pricing</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key:'retail',    label:'Retail',    price:combo.retailPrice    },
                    { key:'wholesale', label:'Wholesale', price:combo.wholesalePrice },
                    { key:'bulk',      label:'Bulk',      price:combo.bulkPrice      },
                  ].filter(t => t.price > 0).map(t => (
                    <button key={t.key} onClick={() => setTier(t.key as any)}
                      className={`rounded-xl p-3 border text-center transition-all ${
                        tier === t.key ? 'border-[#FF6B00] bg-[#FF6B00]/12' : 'border-[#FFD700]/15 hover:border-[#FF6B00]/40'
                      }`}>
                      <div className={`text-[10px] font-semibold tracking-[1px] uppercase ${tier === t.key ? 'text-[#FF6B00]' : 'text-[#BCAAA4]'}`}>{t.label}</div>
                      <div className="text-[18px] font-extrabold text-[#FFF8F0] mt-0.5">₹{formatINR(t.price)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + total */}
              <div className="flex items-center gap-5">
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#BCAAA4] font-semibold mb-2">Quantity</div>
                  <div className="inline-flex items-center rounded-xl overflow-hidden border border-[#FFD700]/20">
                    <button onClick={() => setQty(q => Math.max(1,q-1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#BCAAA4] transition">
                      <Minus size={16}/>
                    </button>
                    <span className="w-14 text-center font-bold text-[18px] text-[#FFF8F0]">{qty}</span>
                    <button onClick={() => setQty(q => q+1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#BCAAA4] transition">
                      <Plus size={16}/>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#BCAAA4] font-semibold mb-2">Total</div>
                  <div className="text-[32px] font-extrabold text-[#FFD700]">₹{formatINR(price * qty)}</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button whileTap={{ scale:0.97 }} onClick={handleAdd}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] transition-all ${
                    added ? 'bg-[#1A7F3E] text-white' : 'bg-[#FF6B00] text-white hover:bg-[#D14600] shadow-[0_8px_24px_rgba(255,107,0,0.40)]'
                  }`}>
                  {added ? <><Check size={18}/> Added!</> : <><ShoppingCart size={18}/> Add to Cart</>}
                </motion.button>
                <a href={buildWhatsAppOrderLink([{ name: combo.name + ' (Combo)', qty, price }])}
                   target="_blank" rel="noopener noreferrer"
                   className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] bg-[#25D366] hover:bg-[#1FB958] text-white transition-all shadow-[0_8px_24px_rgba(37,211,102,0.35)]">
                  <MessageCircle size={18}/> WhatsApp Order
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
