'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Package, ShoppingCart, MessageCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Firework, Sparkles } from '@/components/shared/Firework'
import { FadeUp } from '@/components/home/HomeSections'
import { useCombos } from '@/hooks/useFirestore'
import { formatINR } from '@/lib/utils'

const GRADIENTS = [
  'linear-gradient(155deg, #2A1200 0%, #5B2306 50%, #8B0000 100%)',
  'linear-gradient(155deg, #1B0530 0%, #4A0A56 50%, #8B1E4A 100%)',
  'linear-gradient(155deg, #0E2A1A 0%, #0E5F2E 50%, #1A7F3E 100%)',
  'linear-gradient(155deg, #0E1A2A 0%, #1B3A78 50%, #3A6FCB 100%)',
  'linear-gradient(155deg, #2A0E1A 0%, #561B3A 50%, #8B1E4A 100%)',
  'linear-gradient(155deg, #1A2A0E 0%, #3A5B1B 50%, #1A7F3E 100%)',
]
const VARIANTS: any[] = ['gold','rose','green','cool','violet','crimson']
const ACCENTS = ['#FFD700','#FFB4D2','#9CE6B0','#A0C8FF','#C9B4FF','#FF9C5A']

export default function CombosPage() {
  const { combos, loading } = useCombos()

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#0A0A0A] pt-[72px]">
        {/* Hero */}
        <div className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
          <Sparkles count={40} seed={7}/>
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 text-center">
            <div className="text-[11px] tracking-[3px] uppercase font-semibold text-[#FF6B00] mb-3">Best Value Deals</div>
            <h1 className="text-[#FFD700] font-extrabold text-[48px] md:text-[64px] leading-tight"
                style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
              Combo Packs
            </h1>
            <p className="text-[#BCAAA4] text-[16px] mt-3 max-w-[560px] mx-auto leading-relaxed">
              Hand-assembled in Sivakasi — a balanced mix of sparklers, ground spinners, and aerial shots. Better value than buying individual items.
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 md:px-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[420px] rounded-2xl skeleton"/>
              ))}
            </div>
          ) : combos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-[22px] font-bold text-[#FFD700] mb-2">Combos coming soon!</h3>
              <p className="text-[#BCAAA4] mb-6">Check back soon for amazing combo deals</p>
              <Link href="/shop" className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold hover:bg-[#D14600] transition">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {combos.map((c, i) => (
                <FadeUp key={c.id} delay={i * 0.08}>
                  <div className={`group relative rounded-2xl overflow-hidden p-6 md:p-7 border transition-all duration-300 hover:-translate-y-1 ${
                    c.isFeatured ? 'border-[#FFD700]/60' : 'border-[#FFD700]/15 hover:border-[#FF6B00]/60'
                  }`} style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                    {c.isFeatured && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase bg-[#FFD700] text-[#3D2810]">
                        Most Popular
                      </span>
                    )}
                    {c.tag && (
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white">
                        {c.tag}
                      </span>
                    )}
                    <div className="absolute -top-12 -right-12 w-[200px] h-[200px] rounded-full opacity-40 pointer-events-none"
                         style={{ background:`radial-gradient(circle, ${ACCENTS[i % ACCENTS.length]}55 0%, transparent 65%)` }}/>

                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className="grid place-items-center w-[80px] h-[80px] rounded-2xl bg-black/35 backdrop-blur-sm">
                          <Firework size={64} variant={VARIANTS[i % VARIANTS.length]}/>
                        </div>
                        {c.retailPrice > 0 && c.wholesalePrice > 0 && c.retailPrice > c.wholesalePrice && (
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-[1px] text-white/60 mb-0.5">You save</div>
                            <div className="text-[16px] font-extrabold text-[#1A7F3E] bg-[#E8F8EE] px-2 py-0.5 rounded-lg">
                              ₹{formatINR(c.retailPrice - c.wholesalePrice)}
                            </div>
                          </div>
                        )}
                      </div>

                      <h3 className="font-extrabold text-[#FFD700] text-[24px] leading-tight"
                          style={{ fontFamily:'"Playfair Display", serif' }}>{c.name}</h3>
                      {c.nameTamil && (
                        <div className="text-[13px] mt-1 text-[#FFD700]/70" style={{ fontFamily:'"Noto Serif Tamil", serif' }}>
                          {c.nameTamil}
                        </div>
                      )}
                      {c.description && (
                        <p className="text-[13px] text-white/70 mt-2 leading-relaxed line-clamp-2">{c.description}</p>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <Package size={14} color={ACCENTS[i % ACCENTS.length]}/>
                        <span className="text-[12.5px] text-[#BCAAA4]">{c.items?.length || 0} items inside</span>
                      </div>

                      {/* Pricing tiers */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { label:'Retail', price:c.retailPrice },
                          { label:'W/sale', price:c.wholesalePrice },
                          { label:'Bulk',   price:c.bulkPrice },
                        ].filter(t => t.price > 0).map(t => (
                          <div key={t.label} className="bg-black/25 rounded-lg p-2 text-center">
                            <div className="text-[9px] uppercase tracking-[1px] text-white/60">{t.label}</div>
                            <div className="text-[14px] font-bold text-white">₹{formatINR(t.price)}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-extrabold text-white text-[32px]">₹{formatINR(c.retailPrice)}</span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Link href={`/combos/${c.id}`}
                          className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] transition-all ${
                            c.isFeatured ? 'bg-[#FFD700] text-[#3D2810] hover:bg-white' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }`}>
                          View Details <ArrowRight size={15}/>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}
