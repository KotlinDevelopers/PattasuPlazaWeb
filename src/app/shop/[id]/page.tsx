'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Check, Minus, Plus, MessageCircle, Star, Share2, Shield } from 'lucide-react'
import Link from 'next/link'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import { Firework, Sparkles } from '@/components/shared/Firework'
import { ProductCard, SkeletonCard, FadeUp } from '@/components/home/HomeSections'
import { useProduct, useProducts } from '@/hooks/useFirestore'
import { useCartStore } from '@/lib/store'
import { formatINR, buildWhatsAppOrderLink } from '@/lib/utils'
import type { ProductVariant } from '@/types'

const VARIANT_MAP: Record<string, any> = {
  sparklers:'gold','flower-pots':'crimson',chakkars:'rose',
  rockets:'cool','aerial-shots':'violet','gift-boxes':'green','kids-safe':'gold',
}
const BG_MAP: Record<string, { inner:string; outer:string }> = {
  gold:    { inner:'#FFF1C5', outer:'#FFE08A' },
  crimson: { inner:'#FFE2C8', outer:'#FFB890' },
  rose:    { inner:'#FFE3EE', outer:'#FFB6CF' },
  cool:    { inner:'#E0EBFF', outer:'#B6CCF5' },
  violet:  { inner:'#EDE3FF', outer:'#C9B4FF' },
  green:   { inner:'#E3FFE8', outer:'#9CE6B0' },
}

export default function ProductDetailPage() {
  const params   = useParams()
  const id       = params.id as string
  const addItem  = useCartStore(s => s.addItem)

  const { product, loading, error } = useProduct(id)
  const { products: related }       = useProducts(product?.categoryId, 4)

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [qty,     setQty]    = useState(1)
  const [added,   setAdded]  = useState(false)
  const [tier,    setTier]   = useState<'retail'|'wholesale'|'bulk'>('retail')
  const [imgTab,  setImgTab] = useState(0)
  const [shared,  setShared] = useState(false)

  if (loading) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="skeleton rounded-3xl aspect-square"/>
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4 rounded"/>
              <div className="skeleton h-6 w-1/2 rounded"/>
              <div className="skeleton h-32 w-full rounded-2xl"/>
              <div className="skeleton h-12 w-full rounded-xl"/>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )

  if (error || !product) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px] flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-[24px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-4">Product not found</h2>
          <Link href="/shop" className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold hover:bg-[#D14600] transition">
            Back to Shop
          </Link>
        </div>
      </main>
      <Footer/>
    </>
  )

  const variant     = VARIANT_MAP[product.categoryId] || 'gold'
  const bg          = BG_MAP[variant]
  const activeVar   = selectedVariant || (product.hasVariants ? product.variants?.[0] : null)
  const price       = activeVar?.price ?? (
    tier === 'bulk' ? product.bulkPrice :
    tier === 'wholesale' ? product.wholesalePrice : product.retailPrice
  )
  const savedAmt    = product.isOffer ? Math.round(product.retailPrice * product.offerPercent / 100) : 0
  const relatedFilt = related.filter(p => p.id !== product.id).slice(0,4)

  const handleAdd = () => {
    addItem({
      productId: product.id, productName: product.name,
      productNameTamil: product.nameTamil, variantId: activeVar?.id || '',
      variantDesc: activeVar
        ? [activeVar.size, activeVar.color, activeVar.count].filter(Boolean).join(' · ')
        : '',
      price, tier: tier.toUpperCase() as any,
      quantity: qty, stockCount: product.stockCount, isCombo: false,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: product.name, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); setShared(true); setTimeout(() => setShared(false), 2000) }
  }

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-[#9E7A3A] mb-6 flex-wrap">
            <Link href="/"     className="hover:text-[#FF6B00] transition-colors">Home</Link><span>/</span>
            <Link href="/shop" className="hover:text-[#FF6B00] transition-colors">Shop</Link><span>/</span>
            <Link href={`/shop?category=${product.categoryId}`} className="hover:text-[#FF6B00] transition-colors capitalize">
              {product.categoryId.replace(/-/g,' ')}
            </Link><span>/</span>
            <span className="text-[#7B4F00] dark:text-[#FFD700] font-medium line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

            {/* ── Left: visual ─────────────────────────────── */}
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
              <div className="relative aspect-square rounded-3xl overflow-hidden grid place-items-center"
                   style={{ background:`radial-gradient(circle at 50% 50%, ${bg.inner} 0%, ${bg.outer} 90%)` }}>
                {product.isOffer && (
                  <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-[#D14600] text-white text-[13px] font-bold shadow-lg z-10">
                    -{product.offerPercent}% OFF
                  </span>
                )}
                {product.isFeatured && (
                  <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-white text-[#7B4F00] text-[11px] font-bold tracking-[1px] uppercase shadow-lg z-10">
                    ⭐ Bestseller
                  </span>
                )}
                <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>
                  <Firework size={300} variant={variant}/>
                </motion.div>
                {/* Share */}
                <button onClick={handleShare}
                  className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/90 dark:bg-[#1A1A1A]/90 grid place-items-center text-[#7B4F00] dark:text-[#FFD700] shadow hover:scale-110 transition-transform z-10">
                  {shared ? <Check size={16}/> : <Share2 size={16}/>}
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[12px] text-[#7B4F00] dark:text-[#BCAAA4]">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── Right: info ───────────────────────────────── */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:0.1 }} className="flex flex-col gap-5">

              <div>
                <div className="text-[11px] tracking-[2px] uppercase font-semibold text-[#FF6B00] capitalize">
                  {product.categoryId.replace(/-/g,' ')}
                </div>
                <h1 className="text-[32px] md:text-[38px] font-extrabold leading-tight text-[#3D2810] dark:text-[#FFD700] mt-1"
                    style={{ fontFamily:'"Playfair Display", serif' }}>
                  {product.name}
                </h1>
                {product.nameTamil && (
                  <div className="mt-1 text-[16px] text-[#9E7A3A]" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                    {product.nameTamil}
                  </div>
                )}
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={15} fill="#FFB300" color="#FFB300"/>)}
                <span className="text-[13px] text-[#9E7A3A] ml-1">4.8 · 124 reviews</span>
              </div>

              {/* Pricing tiers */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 border border-[#E9D9B4] dark:border-[#2A2015]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] tracking-[2px] uppercase text-[#9E7A3A] font-semibold">Pricing Tiers</div>
                  <div className="text-[11px] text-[#9E7A3A]">Min order: ₹{formatINR(product.retailMinQty || 1)} pc{(product.retailMinQty || 1) > 1 ? 's' : ''}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key:'retail',    label:'Retail',    price:product.retailPrice,    min:product.retailMinQty    },
                    { key:'wholesale', label:'Wholesale', price:product.wholesalePrice, min:product.wholesaleMinQty },
                    { key:'bulk',      label:'Bulk',      price:product.bulkPrice,      min:product.bulkMinQty      },
                  ].map(t => (
                    <button key={t.key} onClick={() => setTier(t.key as any)}
                      className={`rounded-xl p-3 border text-center transition-all ${
                        tier === t.key ? 'border-[#FF6B00] bg-[#FF6B00]/8 dark:bg-[#FF6B00]/12' : 'border-[#E9D9B4] dark:border-[#2A2015] hover:border-[#FF6B00]/40'
                      }`}>
                      <div className={`text-[10px] font-semibold tracking-[1px] uppercase ${tier === t.key ? 'text-[#FF6B00]' : 'text-[#9E7A3A]'}`}>{t.label}</div>
                      <div className="text-[18px] font-extrabold text-[#3D2810] dark:text-[#FFF8F0] mt-0.5">₹{formatINR(t.price)}</div>
                      <div className="text-[10px] text-[#9E7A3A]">min {t.min || 1}</div>
                    </button>
                  ))}
                </div>
                {savedAmt > 0 && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-[#1A7F3E]/10 border border-[#1A7F3E]/20 text-[12px] text-[#1A7F3E] font-semibold flex items-center gap-2">
                    🎉 You save ₹{formatINR(savedAmt)} per unit with the offer!
                  </div>
                )}
              </div>

              {/* Variants */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#9E7A3A] font-semibold mb-3">
                    Choose Variant
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.filter(v => v.isActive).map(v => (
                      <button key={v.id} onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                          activeVar?.id === v.id
                            ? 'border-[#FF6B00] bg-[#FF6B00] text-white shadow-[0_4px_12px_rgba(255,107,0,0.35)]'
                            : 'border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4] hover:border-[#FF6B00]/60'
                        }`}>
                        <div>{[v.size, v.count].filter(Boolean).join(' · ')}</div>
                        {v.price !== product.retailPrice && (
                          <div className="text-[11px] opacity-80 mt-0.5">₹{formatINR(v.price)}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-5">
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#9E7A3A] font-semibold mb-2">Quantity</div>
                  <div className="inline-flex items-center rounded-xl overflow-hidden border border-[#E9D9B4] dark:border-[#2A2015]">
                    <button onClick={() => setQty(q => Math.max(1,q-1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#7B4F00] dark:text-[#BCAAA4] transition">
                      <Minus size={16}/>
                    </button>
                    <span className="w-14 text-center font-bold text-[18px] text-[#3D2810] dark:text-[#FFF8F0]">{qty}</span>
                    <button onClick={() => setQty(q => q+1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#FF6B00]/10 text-[#7B4F00] dark:text-[#BCAAA4] transition">
                      <Plus size={16}/>
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] tracking-[2px] uppercase text-[#9E7A3A] font-semibold mb-2">Total</div>
                  <div className="text-[28px] font-extrabold text-[#D14600]">₹{formatINR(price * qty)}</div>
                  {qty > 1 && (
                    <div className="text-[12px] text-[#9E7A3A]">₹{formatINR(price)} × {qty}</div>
                  )}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileTap={{ scale:0.97 }}
                  onClick={handleAdd}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] transition-all ${
                    added ? 'bg-[#1A7F3E] text-white'
                      : 'bg-[#FF6B00] text-white hover:bg-[#D14600] shadow-[0_8px_24px_rgba(255,107,0,0.40)]'
                  }`}>
                  {added ? <><Check size={18}/> Added to Cart!</> : <><ShoppingCart size={18}/> Add to Cart</>}
                </motion.button>
                <a href={buildWhatsAppOrderLink([{ name: product.name + (activeVar ? ` (${[activeVar.size, activeVar.count].filter(Boolean).join(' · ')})` : ''), qty, price }])}
                   target="_blank" rel="noopener noreferrer"
                   className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] bg-[#25D366] hover:bg-[#1FB958] text-white transition-all shadow-[0_8px_24px_rgba(37,211,102,0.35)]">
                  <MessageCircle size={18}/> WhatsApp Order
                </a>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-[#E9D9B4] dark:border-[#2A2015] pt-5">
                  <h3 className="text-[14px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-2">About this product</h3>
                  <p className="text-[14px] text-[#7B4F00] dark:text-[#BCAAA4] leading-relaxed">{product.description}</p>
                  {product.descriptionTamil && (
                    <p className="text-[13px] text-[#9E7A3A] mt-2 leading-relaxed" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                      {product.descriptionTamil}
                    </p>
                  )}
                </div>
              )}

              {/* Safety notice */}
              <div className="flex items-start gap-3 bg-[#E8F8EE] dark:bg-[#0E2A1A] rounded-xl p-4 border border-[#1A7F3E]/20">
                <Shield size={18} className="text-[#1A7F3E] shrink-0 mt-0.5"/>
                <div>
                  <div className="text-[13px] font-semibold text-[#1A7F3E]">Safety First</div>
                  <div className="text-[12px] text-[#1A7F3E]/80 mt-0.5">
                    Always light from a safe distance. Keep away from children. Follow all safety instructions on the pack.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          {relatedFilt.length > 0 && (
            <div>
              <h2 className="text-[28px] font-extrabold text-[#7B4F00] dark:text-[#FFD700] mb-6"
                  style={{ fontFamily:'"Playfair Display", serif' }}>
                You might also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedFilt.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}
