import type { Metadata } from 'next'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import { Firework, Ornament } from '@/components/shared/Firework'
import { SectionHeader } from '@/components/shared/SectionHeader'

export const metadata: Metadata = {
  title:       'About Us',
  description: 'Three generations of Sivakasi fireworks craftsmanship. Learn about Pattasu Plaza\'s story since 1995.',
}

const TIMELINE = [
  { year:'1995', title:'Founded in Sivakasi', desc:'Started as a small kiosk on Anaikuttam Main Road by our grandfather. A dream, a cart, and a box of sparklers.' },
  { year:'2003', title:'First Showroom', desc:'Opened the first proper showroom — 1,200 sq ft of premium crackers. The cream-and-saffron store that Sivakasi still knows us by.' },
  { year:'2012', title:'Wholesale Division', desc:'Began serving dealers across Tamil Nadu, Kerala, and Karnataka with wholesale pricing and bulk logistics.' },
  { year:'2019', title:'Pan India Delivery', desc:'Partnered with CCOE-licensed logistics to ship safely across all 28 states. Orders from Himachal to Kerala.' },
  { year:'2024', title:'Digital Storefront', desc:'Launched online ordering — bring the Sivakasi bazaar experience to every Indian home, one cracker at a time.' },
]

const VALUES = [
  { icon:'🏭', title:'Factory Direct',    desc:'We source every product directly from certified Sivakasi manufacturers. No grey-market, no compromises.' },
  { icon:'💯', title:'Safety First',      desc:'CCOE licensed. Every batch is tested. We refuse to stock anything that doesn\'t clear our quality bar.' },
  { icon:'❤️',  title:'Family Tradition', desc:'Three generations, same values — honesty, quality, and a genuine love for the craft of fireworks.' },
  { icon:'🌏', title:'Nationwide Reach',  desc:'Safe, compliant delivery to every corner of India with licensed couriers who know how to handle fireworks.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">

        {/* Hero */}
        <section className="relative bg-[#0A0A0A] py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-end pr-10">
            <Firework size={320} variant="gold"/>
          </div>
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-[11px] tracking-[3px] uppercase font-semibold text-[#FF6B00] mb-3">Est. 1995 · Sivakasi</div>
            <h1 className="text-[#FFD700] font-extrabold text-[48px] md:text-[64px] leading-tight max-w-[700px]"
                style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
              The Story Behind<br/>the Sparkle
            </h1>
            <p className="text-[#BCAAA4] text-[16px] mt-4 max-w-[560px] leading-relaxed">
              Three generations. One family. One conviction — that Diwali deserves the very best.
            </p>
            <div className="mt-6">
              <Ornament color="#FF6B00" width={200}/>
            </div>
          </div>
        </section>

        {/* Story section */}
        <section className="py-16 md:py-20 bg-[#FAF0DC] dark:bg-[#0D0D0D]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[34px] font-extrabold text-[#7B4F00] dark:text-[#FFD700] mb-5"
                    style={{ fontFamily:'"Playfair Display", serif' }}>
                  Three Generations of <em style={{ fontStyle:'italic', color:'#D14600' }}>Craftsmanship</em>
                </h2>
                <div className="space-y-4 text-[15px] text-[#7B4F00] dark:text-[#BCAAA4] leading-relaxed">
                  <p>It started with our grandfather, Murugesan, who began trading Sivakasi crackers from a hand-pushed cart in 1995. His eye for quality — refusing to stock anything that didn't meet his personal standard — built a reputation that spread by word of mouth.</p>
                  <p>His son, our father Selvakumar, turned the cart into a showroom in 2003. The cream-and-saffron frontage on Anaikuttam Main Road became a landmark. Customers drove from Virudhunagar, Madurai, and beyond.</p>
                  <p>Today, the third generation runs the digital storefront you're browsing now — but the values haven't changed. Every product we sell carries the same three-generation stamp: genuine Sivakasi quality, honest pricing, and the belief that every family deserves a safe, spectacular Diwali.</p>
                </div>
              </div>

              {/* Visual timeline */}
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#FF6B00] via-[#FFD700] to-transparent"/>
                <div className="space-y-6 pl-10">
                  {TIMELINE.map((t, i) => (
                    <div key={t.year} className="relative">
                      <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-[#FF6B00] bg-[#FAF0DC] dark:bg-[#0D0D0D]"/>
                      <div className="text-[11px] tracking-[2px] uppercase font-bold text-[#FF6B00] mb-1">{t.year}</div>
                      <div className="font-bold text-[16px] text-[#3D2810] dark:text-[#FFD700] mb-1">{t.title}</div>
                      <div className="text-[14px] text-[#7B4F00] dark:text-[#BCAAA4] leading-relaxed">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <SectionHeader
              dark eyebrow="What We Stand For" title="Our" italicWord="Values"
              subtitle="Not a corporate mission statement — just the things our grandfather taught us."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map((v, i) => (
                <div key={v.title}
                     className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#FFD700]/10 hover:border-[#FF6B00]/40 transition-all hover:-translate-y-1 duration-300">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <div className="font-bold text-[#FFD700] text-[17px] mb-2">{v.title}</div>
                  <div className="text-[13px] text-[#BCAAA4] leading-relaxed">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#FAF0DC] dark:bg-[#0D0D0D]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { num:'30+',  label:'Years in Business' },
                { num:'500+', label:'Products in Stock'  },
                { num:'4,500+', label:'Happy Families'   },
                { num:'28',   label:'States Delivered'   },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[42px] md:text-[52px] font-extrabold text-[#FF6B00] leading-none mb-2"
                       style={{ fontFamily:'"Playfair Display", serif' }}>
                    {s.num}
                  </div>
                  <div className="text-[13px] font-semibold text-[#7B4F00] dark:text-[#BCAAA4] uppercase tracking-[1.5px]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}
