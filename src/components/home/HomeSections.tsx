'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check, ShoppingCart, Package, MessageCircle } from 'lucide-react'
import { Firework, Sparkles, ParticleField, IconWhatsApp, IconStar, Ornament, Flame } from '@/components/shared/Firework'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useCountdown }   from '@/hooks/useCountdown'
import { formatINR, buildWhatsAppOrderLink, discountPercent } from '@/lib/utils'
import { DIWALI_DATE }    from '@/lib/brand'
import { useCartStore }   from '@/lib/store'
import type { Product, Category, Combo, Banner, AppConfig } from '@/types'
import type { FireworkVariant } from '@/lib/brand'

// ── FadeUp wrapper ────────────────────────────────────────
export function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.25, 1] }}
      className={className}>
      {children}
    </motion.div>
  )
}

// ── Skeleton ──────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015]">
      <div className="skeleton h-[180px] w-full"/>
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded"/>
        <div className="skeleton h-3 w-1/2 rounded"/>
        <div className="skeleton h-3 w-2/3 rounded"/>
        <div className="skeleton h-9 w-full rounded-xl mt-3"/>
      </div>
    </div>
  )
}

// ── Variant color map ─────────────────────────────────────
const VARIANT_MAP: Record<string, FireworkVariant> = {
  sparklers: 'gold', 'flower-pots': 'crimson', chakkars: 'rose',
  rockets: 'cool', 'aerial-shots': 'violet', 'gift-boxes': 'green',
  'kids-safe': 'gold', combos: 'crimson',
}
const BG_MAP: Record<FireworkVariant, { inner: string; outer: string }> = {
  gold:    { inner: '#FFF1C5', outer: '#FFE08A' },
  crimson: { inner: '#FFE2C8', outer: '#FFB890' },
  rose:    { inner: '#FFE3EE', outer: '#FFB6CF' },
  cool:    { inner: '#E0EBFF', outer: '#B6CCF5' },
  violet:  { inner: '#EDE3FF', outer: '#C9B4FF' },
  green:   { inner: '#E3FFE8', outer: '#9CE6B0' },
}

// ═══════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════
export function HeroSection({ config }: { config?: AppConfig | null }) {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center"
      style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 35%, #2A1200 0%, #14080A 55%, #0A0A0A 100%)' }}>
      <div className="pointer-events-none absolute inset-0"
           style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.6) 100%)' }}/>
      <ParticleField count={26} seed={3}/>
      <Sparkles count={48} seed={11}/>

      <div className="relative z-10 px-5 max-w-[920px] mx-auto pt-28 pb-16">
        <motion.div className="relative mx-auto mb-8" style={{ width: 220, height: 220 }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.25, 1] }}>
          <div className="absolute -inset-8 rounded-full pp-pulse-glow"
               style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,107,0,0.18) 40%, transparent 70%)' }}/>
          <div className="relative w-full h-full rounded-[36px] grid place-items-center"
               style={{ background: 'linear-gradient(160deg, #1a0f06 0%, #08060a 100%)',
                 boxShadow: '0 0 0 1px rgba(255,215,0,0.28), 0 30px 80px rgba(255,140,0,0.20)' }}>
            <div className="absolute inset-0 rounded-[36px]"
                 style={{ background: 'radial-gradient(circle at 50% 35%, rgba(255,140,0,0.18) 0%, transparent 60%)' }}/>
            <Firework size={170} variant="gold"/>
          </div>
        </motion.div>

        <motion.div className="inline-flex items-center gap-3 text-[11px] tracking-[3px] uppercase font-semibold text-[#BCAAA4] mb-5"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
          <span className="h-px w-8 bg-[#FF6B00]/60"/> EST. 1995 · Sivakasi <span className="h-px w-8 bg-[#FF6B00]/60"/>
        </motion.div>

        <motion.h1
          className="text-[#FFD700] font-extrabold leading-[1.02] tracking-tight mb-5 text-[44px] sm:text-[56px] md:text-[64px]"
          style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', textShadow: '0 0 28px rgba(255,215,0,0.25)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
          {config?.shopName || "Sivakasi's Finest"}<br className="hidden sm:block"/>
          <span style={{ fontStyle: 'italic' }}>Fireworks</span>
        </motion.h1>

        <motion.div className="text-[#FFD700]/80 mb-4 text-[22px]"
          style={{ fontFamily: '"Noto Serif Tamil", serif' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
          {config?.shopNameTamil || 'சிவகாசியின் சிறந்த பட்டாசுகள்'}
        </motion.div>

        <motion.p className="text-[#E8DDC9] text-[15px] sm:text-[16px] tracking-wide font-medium mb-9 max-w-[560px] mx-auto"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
          {config?.tagline || 'Direct from factory · Premium quality · Diwali 2025'}
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
          <Link href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white font-semibold text-[15px] shadow-[0_10px_30px_rgba(255,107,0,0.45)] hover:shadow-[0_14px_40px_rgba(255,107,0,0.6)] hover:-translate-y-0.5 transition-all">
            Shop Now <ArrowRight size={16}/>
          </Link>
          <a href={`https://wa.me/${config?.whatsapp || '919876543210'}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#FFD700]/60 text-[#FFD700] hover:bg-[#FFD700]/10 font-semibold text-[15px] transition-all">
            <IconWhatsApp size={16} color="#FFD700"/> WhatsApp Order
          </a>
        </motion.div>

        <motion.div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[12px] tracking-[2px] uppercase text-[#8D6E63] font-medium"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }}>
          <span>100% Authentic</span><span className="text-[#FF6B00]">·</span>
          <span>4500+ Happy Families</span><span className="text-[#FF6B00]">·</span>
          <span>Govt. Licensed</span>
        </motion.div>
      </div>

      <a href="#trust" aria-label="Scroll down" className="absolute left-1/2 -translate-x-1/2 bottom-6 z-10 grid place-items-center">
        <span className="block text-[10px] uppercase tracking-[3px] text-[#BCAAA4] mb-2">Scroll</span>
        <span className="block w-6 h-10 rounded-full border border-[#FFD700]/40 relative">
          <span className="absolute left-1/2 -translate-x-1/2 top-2 w-1 h-2 rounded-full bg-[#FFD700] pp-scroll-dot"/>
        </span>
      </a>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// TRUST SECTION
// ═══════════════════════════════════════════════════════════
const TRUST_ITEMS = [
  { icon: '🏭', title: 'Direct from Sivakasi',  sub: 'No middlemen · factory pricing'    },
  { icon: '⚡', title: 'Same Day Dispatch',      sub: 'Order before 4 PM · ships today'   },
  { icon: '💯', title: 'Quality Assured',        sub: 'CCOE licensed · safety tested'     },
  { icon: '🚚', title: 'Pan India Delivery',     sub: 'All 28 states · 4–7 day delivery'  },
]

export function TrustSection() {
  return (
    <section id="trust" className="relative bg-[#FAF0DC] dark:bg-[#0A0A0A] py-14 md:py-16">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {TRUST_ITEMS.map((it, i) => (
          <FadeUp key={it.title} delay={i * 0.08}>
            <div className="group bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 md:p-6 flex items-start gap-4 border border-[#E9D9B4] dark:border-[#2A2015] hover:border-[#FF6B00]/50 hover:shadow-[0_10px_30px_rgba(255,107,0,0.10)] transition-all h-full">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFEFC4] to-[#FFD27A] text-2xl shrink-0">
                {it.icon}
              </span>
              <div>
                <div className="font-semibold text-[#7B4F00] dark:text-[#FFD700] text-[15px] leading-tight">{it.title}</div>
                <div className="text-[12.5px] text-[#9E7A3A] dark:text-[#BCAAA4] mt-1 leading-snug">{it.sub}</div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// BANNER CAROUSEL
// ═══════════════════════════════════════════════════════════
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)
  if (!banners.length) return null

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[200px] md:h-[280px]"
           style={{ background: 'linear-gradient(110deg, #FF6B00 0%, #E64500 45%, #8B0000 100%)' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1.5px)', backgroundSize: '22px 22px' }}/>
        {banners.map((b, i) => (
          <motion.div key={b.id}
            className="absolute inset-0 flex items-center justify-center text-center px-8"
            initial={{ opacity: 0 }} animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 0.5 }}>
            <div>
              <h2 className="font-extrabold text-white text-[28px] md:text-[40px]"
                  style={{ fontFamily: '"Playfair Display", serif' }}>{b.title}</h2>
              {b.titleTamil && (
                <div className="text-white/80 mt-1 text-[16px]"
                     style={{ fontFamily: '"Noto Serif Tamil", serif' }}>{b.titleTamil}</div>
              )}
            </div>
          </motion.div>
        ))}
        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40'}`}/>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// CATEGORIES SECTION
// ═══════════════════════════════════════════════════════════
export function CategoriesSection({ categories, loading }: { categories: Category[]; loading: boolean }) {
  return (
    <section id="categories" className="relative bg-[#0A0A0A] py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, #2A1200 0%, transparent 60%)' }}/>
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
        <SectionHeader dark eyebrow="Curated Collections" title="Shop by" italicWord="Category"
          subtitle="From dainty sparklers for the little ones to thunderous aerial spectaculars — sourced direct from Sivakasi."/>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[120px] rounded-2xl skeleton"/>
              ))
            : categories.map((c, i) => {
                const variant = VARIANT_MAP[c.id] || 'gold'
                return (
                  <FadeUp key={c.id} delay={i * 0.06}>
                    <Link href={`/shop?category=${c.id}`}
                      className="group relative block rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#FFD700]/10 hover:border-[#FF6B00]/60 transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                           style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,107,0,0.20) 0%, transparent 60%)' }}/>
                      <div className="relative p-5 md:p-6 flex items-center gap-4">
                        <div className="grid place-items-center shrink-0 w-[88px] h-[88px] rounded-xl bg-[#0F0907]">
                          <Firework size={70} variant={variant as FireworkVariant}/>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[#FFD700] font-bold text-[17px] tracking-tight leading-tight">{c.name}</div>
                          {c.nameTamil && (
                            <div className="text-[13px] mt-0.5" style={{ fontFamily: '"Noto Serif Tamil", serif', color: 'rgba(255,215,0,0.6)' }}>
                              {c.nameTamil}
                            </div>
                          )}
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[1.5px] uppercase text-[#BCAAA4] font-medium">
                            <span className="w-1 h-1 rounded-full bg-[#FF6B00]"/>
                            Browse
                          </div>
                        </div>
                        <ArrowRight className="text-[#FF6B00] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" size={22}/>
                      </div>
                    </Link>
                  </FadeUp>
                )
              })
          }
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// OFFER BANNER
// ═══════════════════════════════════════════════════════════
export function OfferBannerSection({ config }: { config?: AppConfig | null }) {
  const target = DIWALI_DATE
  const { dStr, hStr, mStr, sStr } = useCountdown(target)
  const blocks = [{ v: dStr, l: 'Days' }, { v: hStr, l: 'Hours' }, { v: mStr, l: 'Mins' }, { v: sStr, l: 'Secs' }]

  return (
    <section className="relative overflow-hidden text-white"
             style={{ background: 'linear-gradient(110deg, #FF6B00 0%, #E64500 45%, #8B0000 100%)' }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1.5px)', backgroundSize: '22px 22px' }}/>
      <div className="absolute -right-32 -top-32 w-[420px] h-[420px] rounded-full opacity-50 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.55) 0%, transparent 65%)' }}/>
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 py-8 md:py-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <div className="text-center lg:text-left lg:flex-1">
          <div className="text-[11px] tracking-[3px] uppercase font-semibold opacity-80 mb-1">Limited Time</div>
          <h3 className="font-extrabold leading-[1.02] text-[28px] md:text-[36px]"
              style={{ fontFamily: '"Playfair Display", serif' }}>
            🔥 Diwali Mega Sale — <em className="text-[#FFD700]" style={{ fontStyle: 'italic' }}>Up to 45% OFF</em>
          </h3>
          <div className="mt-1.5 text-[14px] opacity-90">On 300+ items · Combo packs · Premium aerials</div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {blocks.map((b, i) => (
            <span key={b.l} className="flex items-center gap-2 md:gap-3">
              <div className="grid place-items-center w-[64px] md:w-[76px] h-[64px] md:h-[76px] rounded-xl bg-black/35 backdrop-blur-sm border border-white/15">
                <div className="font-mono font-extrabold text-[22px] md:text-[28px] tabular-nums text-[#FFD700]">{b.v}</div>
                <div className="text-[9px] md:text-[10px] tracking-[2px] uppercase opacity-80">{b.l}</div>
              </div>
              {i < blocks.length - 1 && <span className="text-[#FFD700] text-xl font-bold opacity-70">:</span>}
            </span>
          ))}
        </div>
        <Link href="/shop?filter=offers"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#8B0000] font-bold text-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition-transform">
          Shop Offers <ArrowRight size={16}/>
        </Link>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// PRODUCT CARD (reusable)
// ═══════════════════════════════════════════════════════════
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false)
  const addItem           = useCartStore(s => s.addItem)
  const variant           = (VARIANT_MAP[product.categoryId] || 'gold') as FireworkVariant
  const bg                = BG_MAP[variant]
  const totalQty          = useCartStore(s => s.totalQty())
  // Pricing tier based on cart qty
  const tier = totalQty >= (product.bulkMinQty || 20) ? 'BULK'
    : totalQty >= (product.wholesaleMinQty || 5) ? 'WHOLESALE' : 'RETAIL'
  const displayPrice = tier === 'BULK' ? product.bulkPrice
    : tier === 'WHOLESALE' ? product.wholesalePrice : product.retailPrice
  const savedAmt = product.isOffer ? Math.round(product.retailPrice * product.offerPercent / 100) : 0

  const handleAdd = () => {
    addItem({
      productId: product.id, productName: product.name,
      productNameTamil: product.nameTamil, variantId: '',
      variantDesc: '', price: displayPrice,
      tier: tier as any, quantity: 1,
      stockCount: product.stockCount, isCombo: false,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <FadeUp delay={index * 0.07}>
      <div className="group bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#E9D9B4] dark:border-[#2A2015] hover:shadow-[0_18px_50px_rgba(124,79,0,0.18)] dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition-all duration-300">
        {/* Image area */}
        <Link href={`/shop/${product.id}`}>
          <div className="relative aspect-[4/3] grid place-items-center overflow-hidden cursor-pointer"
               style={{ background: `radial-gradient(circle at 50% 50%, ${bg.inner} 0%, ${bg.outer} 90%)` }}>
            {product.isOffer && product.offerPercent > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D14600] text-white shadow z-10">
                -{product.offerPercent}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[1.5px] uppercase bg-white/95 text-[#7B4F00] shadow z-10">
                ⭐ Top
              </span>
            )}
            {product.stockCount <= 10 && product.stockCount > 0 && (
              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/30 z-10">
                Only {product.stockCount} left!
              </span>
            )}
            <div className="transition-transform duration-500 group-hover:scale-110">
              <Firework size={140} variant={variant}/>
            </div>
          </div>
        </Link>

        {/* Body */}
        <div className="p-4 md:p-5">
          <div className="text-[10px] tracking-[2px] uppercase text-[#9E7A3A] dark:text-[#8D6E63] font-semibold capitalize">
            {product.categoryId.replace(/-/g,' ')}
          </div>
          <Link href={`/shop/${product.id}`}>
            <div className="mt-1 font-bold text-[15px] text-[#3D2810] dark:text-[#FFF8F0] leading-snug line-clamp-2 hover:text-[#FF6B00] transition-colors cursor-pointer">
              {product.name}
            </div>
          </Link>
          {product.nameTamil && (
            <div className="text-[12px] text-[#9E7A3A] dark:text-[#8D6E63] mt-0.5 line-clamp-1"
                 style={{ fontFamily: '"Noto Serif Tamil", serif' }}>
              {product.nameTamil}
            </div>
          )}

          {/* Price + discount */}
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="font-extrabold text-[22px] text-[#D14600]">₹{formatINR(displayPrice)}</span>
            {product.isOffer && savedAmt > 0 && (
              <span className="text-[12px] font-bold text-[#1A7F3E] bg-[#E8F8EE] dark:bg-[#0E2A1A] rounded-full px-2 py-0.5">
                Save ₹{formatINR(savedAmt)}
              </span>
            )}
          </div>

          {/* Tier pills */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {[
              { label: `R ₹${formatINR(product.retailPrice)}`,    active: tier === 'RETAIL',    color: 'bg-[#FF6B00]/10 text-[#D14600]' },
              { label: `W ₹${formatINR(product.wholesalePrice)}`, active: tier === 'WHOLESALE', color: 'bg-[#FFD700]/15 text-[#7B4F00] dark:text-[#B8860B]' },
              { label: `B ₹${formatINR(product.bulkPrice)}`,      active: tier === 'BULK',      color: 'bg-[#4CAF50]/10 text-[#1A7F3E]' },
            ].map(t => (
              <span key={t.label}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${t.color} ${t.active ? 'ring-1 ring-current scale-105' : 'opacity-70'}`}>
                {t.label}
              </span>
            ))}
          </div>

          <button onClick={handleAdd}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all ${
              added ? 'bg-[#1A7F3E] text-white' : 'bg-[#FF6B00] text-white hover:bg-[#D14600] shadow-[0_6px_20px_rgba(255,107,0,0.32)]'
            }`}>
            {added ? <><Check size={15}/> Added!</> : <><ShoppingCart size={15}/> Add to Cart</>}
          </button>
        </div>
      </div>
    </FadeUp>
  )
}

// ═══════════════════════════════════════════════════════════
// FEATURED PRODUCTS
// ═══════════════════════════════════════════════════════════
export function ProductsSection({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <section id="products" className="relative bg-[#FAF0DC] dark:bg-[#0D0D0D] py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <SectionHeader eyebrow="Hand-picked for Diwali" title="Featured" italicWord="Products"
          subtitle="The crackers our regulars buy by the box, year after year."
          action={
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#D14600] hover:text-[#FF6B00]">
              View All <ArrowRight size={16}/>
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i}/>)
            : products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)
          }
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// COMBOS SECTION
// ═══════════════════════════════════════════════════════════
const COMBO_GRADIENTS = [
  'linear-gradient(155deg, #2A1200 0%, #5B2306 50%, #8B0000 100%)',
  'linear-gradient(155deg, #1B0530 0%, #4A0A56 50%, #8B1E4A 100%)',
  'linear-gradient(155deg, #0E2A1A 0%, #0E5F2E 50%, #1A7F3E 100%)',
]
const COMBO_VARIANTS: FireworkVariant[] = ['gold', 'rose', 'green']
const COMBO_ACCENTS  = ['#FFD700', '#FFB4D2', '#9CE6B0']

export function CombosSection({ combos, loading }: { combos: Combo[]; loading: boolean }) {
  return (
    <section id="combos" className="relative bg-[#0A0A0A] py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, #2A1200 0%, transparent 65%)' }}/>
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
        <SectionHeader dark eyebrow="Best Value" title="Curated" italicWord="Combo Packs"
          subtitle="Hand-assembled in Sivakasi. Every box is a balanced mix — sparklers for the kids, ground spinners for the courtyard, aerial shots to light up the sky."
          action={
            <Link href="/combos" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#FF8C2A] hover:text-[#FFD700]">
              View All Combos <ArrowRight size={16}/>
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[380px] rounded-2xl skeleton"/>)
            : combos.slice(0, 3).map((c, i) => (
                <FadeUp key={c.id} delay={i * 0.1}>
                  <div className={`group relative rounded-2xl overflow-hidden p-6 md:p-7 border transition-all duration-300 hover:-translate-y-1 ${
                    c.isFeatured ? 'border-[#FFD700]/60 md:scale-[1.02]' : 'border-[#FFD700]/15 hover:border-[#FF6B00]/60'
                  }`} style={{ background: COMBO_GRADIENTS[i % 3] }}>
                    {c.isFeatured && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase bg-[#FFD700] text-[#3D2810] shadow">
                        Most Popular
                      </span>
                    )}
                    <div className="absolute -top-12 -right-12 w-[200px] h-[200px] rounded-full opacity-50 pointer-events-none"
                         style={{ background: `radial-gradient(circle, ${COMBO_ACCENTS[i % 3]}55 0%, transparent 65%)` }}/>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="grid place-items-center w-16 h-16 rounded-xl bg-black/35 backdrop-blur-sm">
                          <Firework size={56} variant={COMBO_VARIANTS[i % 3]}/>
                        </div>
                        {c.retailPrice > 0 && c.wholesalePrice > 0 && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1A7F3E] text-white">
                            Save ₹{formatINR(c.retailPrice - c.wholesalePrice)}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-[#FFD700] text-[22px] leading-tight"
                          style={{ fontFamily: '"Playfair Display", serif' }}>{c.name}</h4>
                      {c.nameTamil && (
                        <div className="text-[13px] mt-0.5" style={{ fontFamily: '"Noto Serif Tamil", serif', color: 'rgba(255,215,0,0.7)' }}>
                          {c.nameTamil}
                        </div>
                      )}
                      {c.tag && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white">{c.tag}</span>
                      )}
                      <div className="mt-4 flex items-center gap-2 text-[12.5px] text-[#BCAAA4]">
                        <Package size={14} color={COMBO_ACCENTS[i % 3]}/>
                        {c.items?.length || 0} items inside
                      </div>
                      <div className="mt-5 flex items-baseline gap-2.5">
                        <span className="font-extrabold text-white text-[28px]">₹{formatINR(c.retailPrice)}</span>
                        {c.wholesalePrice > 0 && c.wholesalePrice < c.retailPrice && (
                          <span className="text-[14px] text-[#BCAAA4] line-through">₹{formatINR(c.wholesalePrice)}</span>
                        )}
                      </div>
                      <Link href={`/combos/${c.id}`}
                        className={`mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] transition-all ${
                          c.isFeatured ? 'bg-[#FFD700] text-[#3D2810] hover:bg-white' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}>
                        Order Now <ArrowRight size={15}/>
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              ))
          }
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════
export function HowItWorksSection() {
  const steps = [
    { n:'01', title:'Browse Catalogue', desc:'Pick from 300+ crackers and combo packs. Filter by category, price, or family size.',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18"/><path d="M8 14l3-3 2 2 3-4"/></svg> },
    { n:'02', title:'WhatsApp Order', desc:'Send us your list on WhatsApp. We confirm stock and lock pricing within 10 minutes.',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19.05 4.91A10 10 0 0 0 4.07 18l-1.4 5 5.13-1.34A10 10 0 1 0 19.05 4.91z"/><path d="M9 10c.5 2 2 3.5 4 4"/></svg> },
    { n:'03', title:'Doorstep Delivery', desc:'Licensed couriers deliver pan India in 4–7 days. Track every step from factory to door.',
      icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17V7a2 2 0 0 1 2-2h11l5 5v7a2 2 0 0 1-2 2h-1"/><circle cx="7.5" cy="17.5" r="2.2"/><circle cx="17" cy="17.5" r="2.2"/><path d="M9.7 17.5h5"/></svg> },
  ]
  return (
    <section id="how" className="relative bg-[#FAF0DC] dark:bg-[#0D0D0D] py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <SectionHeader eyebrow="Simple & Trusted" title="How It" italicWord="Works"
          subtitle="From clicking 'Add to Cart' in Chennai to a box on your doorstep — three simple steps."/>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-0">
          <svg className="hidden md:block absolute" style={{ top:58, left:'16.66%', right:'16.66%', width:'66.67%', height:2 }} preserveAspectRatio="none">
            <line x1="0" y1="1" x2="100%" y2="1" stroke="#D14600" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.45"/>
          </svg>
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.12}>
              <div className="relative text-center px-3 md:px-6">
                <div className="relative mx-auto w-[116px] h-[116px] mb-5">
                  <div className="absolute inset-0 rounded-full bg-white dark:bg-[#1A1A1A] border-2 border-dashed border-[#FF6B00]/50"/>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#FFD27A] to-[#FF6B00] grid place-items-center text-white shadow-[0_12px_30px_rgba(255,107,0,0.32)]">
                    {s.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 grid place-items-center w-9 h-9 rounded-full bg-white dark:bg-[#1A1A1A] text-[#D14600] text-[12px] font-extrabold border border-[#FF6B00]/40 shadow">
                    {s.n}
                  </span>
                </div>
                <h4 className="font-extrabold text-[22px] text-[#3D2810] dark:text-[#FFD700] mb-2"
                    style={{ fontFamily: '"Playfair Display", serif' }}>{s.title}</h4>
                <p className="text-[14px] text-[#7B4F00]/85 dark:text-[#BCAAA4] leading-relaxed max-w-[320px] mx-auto">{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// SHOP INFO
// ═══════════════════════════════════════════════════════════
export function ShopInfoSection({ config }: { config?: AppConfig | null }) {
  const phone    = config?.phone1    || '+91 98765 43210'
  const whatsapp = config?.whatsapp  || '919876543210'
  const address  = config?.address   || '42, Anaikuttam Main Road, Near New Bus Stand, Sivakasi, Tamil Nadu 626123'
  const hours    = config?.businessHours || 'Mon–Sat 9AM–9PM · Sun 10AM–6PM'

  return (
    <section id="contact" className="relative bg-[#0A0A0A] py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
        <SectionHeader dark eyebrow="Visit · Call · WhatsApp" title="The" italicWord="Shop"
          subtitle="Three generations on Sivakasi's main bazaar street. Open 364 days a year."/>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 rounded-2xl overflow-hidden border border-[#FFD700]/15 bg-[#13100C]">
          <div className="lg:col-span-3 p-6 md:p-8">
            <div className="text-[11px] tracking-[3px] uppercase text-[#FF6B00] font-semibold mb-3">Address</div>
            <div className="font-bold text-[#FFD700] text-[20px] mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
              {config?.shopName || 'Pattasu Plaza Showroom'}
            </div>
            <div className="text-[14px] text-[#E8DDC9] leading-relaxed mb-6">{address}</div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#FF6B00] font-semibold mb-2">Hours</div>
                <div className="text-[14px] text-[#E8DDC9]">{hours}</div>
              </div>
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#FF6B00] font-semibold mb-2">Phone</div>
                <a href={`tel:${phone.replace(/\s/g,'')}`} className="text-[14px] text-[#FFD700] font-semibold hover:underline">{phone}</a>
              </div>
            </div>
            {/* Map stub */}
            <div className="rounded-xl overflow-hidden border border-[#FFD700]/15 relative h-[180px]">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                <defs><pattern id="mg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#FFD700" strokeOpacity="0.07" strokeWidth="1"/></pattern></defs>
                <rect width="600" height="200" fill="#0F0907"/>
                <rect width="600" height="200" fill="url(#mg)"/>
                <path d="M0 130 Q 150 110 320 120 T 600 90" stroke="#3D2810" strokeWidth="10" fill="none"/>
                <path d="M200 0 L 230 200" stroke="#3D2810" strokeWidth="6" fill="none"/>
                <rect x="50" y="30" width="120" height="60" rx="4" fill="#1A1410"/>
                <rect x="260" y="20" width="140" height="70" rx="4" fill="#1A1410"/>
                <g transform="translate(340 115)">
                  <circle r="22" fill="#FF6B00" opacity="0.25"/><circle r="14" fill="#FF6B00" opacity="0.45"/>
                  <path d="M0 -18 C -10 -18 -14 -10 -14 -4 C -14 6 0 18 0 18 C 0 18 14 6 14 -4 C 14 -10 10 -18 0 -18 Z" fill="#FF6B00"/>
                  <circle cy="-5" r="4" fill="#FFD700"/>
                </g>
                <text x="356" y="118" fill="#FFD700" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">Pattasu Plaza</text>
              </svg>
              <a href="https://maps.google.com/?q=Sivakasi+Tamil+Nadu" target="_blank" rel="noopener noreferrer"
                 className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#7B4F00] text-[12px] font-semibold shadow">
                📍 Get Directions
              </a>
            </div>
          </div>
          <div className="lg:col-span-2 p-6 md:p-8 relative"
               style={{ background: 'linear-gradient(165deg, #0E2A1A 0%, #0E5F2E 60%, #1A7F3E 100%)' }}>
            <div className="absolute -top-10 -right-10 w-[220px] h-[220px] rounded-full opacity-50 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(156,230,176,0.4) 0%, transparent 65%)' }}/>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] tracking-[2px] uppercase font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#9CE6B0] pp-pulse"/> Online now · replies in 5 min
              </div>
              <h4 className="font-extrabold text-white text-[26px] leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                Order on <em style={{ fontStyle: 'italic' }} className="text-[#9CE6B0]">WhatsApp</em>
              </h4>
              <p className="text-[14px] text-white/85 mt-2 leading-relaxed">
                Easiest way to shop. Send your list, we confirm stock and arrange delivery.
              </p>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                 className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-[#0E5F2E] font-bold text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform">
                <IconWhatsApp size={18} color="#25D366"/> Message us on WhatsApp
              </a>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={`tel:${phone.replace(/\s/g,'')}`} className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg bg-black/25 hover:bg-black/40 transition">
                  <span className="text-[10px] tracking-[2px] uppercase text-white/70">Call us</span>
                  <span className="text-white font-bold text-[14px] tabular-nums">{phone}</span>
                </a>
                <a href="mailto:hello@pattasuplaza.in" className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg bg-black/25 hover:bg-black/40 transition">
                  <span className="text-[10px] tracking-[2px] uppercase text-white/70">Email</span>
                  <span className="text-white font-bold text-[13px]">hello@pattasuplaza.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════
const TESTIMONIALS = [
  { stars:5, quote:'Third Diwali in a row ordering from Pattasu Plaza. The combo packs are properly weighed — none of the under-filling other sellers do. Aerial shots were spectacular.', name:'Karthik Subramanian', loc:'Bengaluru, KA' },
  { stars:5, quote:'Ordered the Kids Safe Pack for my daughter\'s first Diwali. Everything labelled, instructions in English and Tamil. Will absolutely recommend to everyone.', name:'Priya Iyer', loc:'Mumbai, MH' },
  { stars:5, quote:'WhatsApp ordering is brilliant — sent them my list, had a quote back in 8 minutes. Delivered to Gurgaon in 5 days. Excellent packaging, zero damage.', name:'Arjun Mehta', loc:'Gurgaon, HR' },
]

export function TestimonialsSection() {
  return (
    <section id="reviews" className="relative bg-[#FAF0DC] dark:bg-[#0D0D0D] py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <SectionHeader eyebrow="4,500+ Happy Families" title="What Customers" italicWord="Say"
          subtitle="Reviews from verified orders across India."/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.08}>
              <figure className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 border border-[#E9D9B4] dark:border-[#2A2015] hover:shadow-[0_18px_50px_rgba(124,79,0,0.16)] transition-all flex flex-col h-full">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, k) => <IconStar key={k} size={16}/>)}
                </div>
                <blockquote className="text-[15px] leading-relaxed text-[#3D2810] dark:text-[#E8DDC9] flex-1 relative">
                  <span className="absolute -top-3 -left-1 text-[#FF6B00]/30 text-[44px] leading-none font-serif select-none"
                        style={{ fontFamily: '"Playfair Display", serif' }}>"</span>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-[#E9D9B4] dark:border-[#2A2015] flex items-center gap-3">
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD27A] to-[#FF6B00] text-white font-bold text-[14px]">
                    {t.name.split(' ').map(w => w[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#3D2810] dark:text-[#FFF8F0]">{t.name}</div>
                    <div className="text-[12px] text-[#9E7A3A]">{t.loc}</div>
                  </div>
                  <div className="ml-auto text-[10px] tracking-[1.5px] uppercase font-semibold text-[#1A7F3E] bg-[#E8F8EE] dark:bg-[#0E2A1A] px-2 py-1 rounded-full">
                    Verified
                  </div>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
