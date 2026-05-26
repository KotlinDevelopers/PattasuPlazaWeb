'use client'
import Link from 'next/link'
import { Flame, IconWhatsApp, Ornament } from '@/components/shared/Firework'

const SHOP_LINKS    = ['Sparklers', 'Flower Pots', 'Chakkars', 'Rockets', 'Aerial Shots', 'Combo Packs']
const SUPPORT_LINKS = ['Track Order', 'Shipping & Delivery', 'Returns & Refunds', 'Safety Guide', 'FAQ', 'Contact Us']
const COMPANY_LINKS = ['About Us', 'Our Factory', 'Bulk Orders', 'Privacy Policy', 'Terms & Conditions', 'Blog']

function SocialBtn({ children, href = '#' }: { children: React.ReactNode; href?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="grid place-items-center w-9 h-9 rounded-full border border-[#FFD700]/25 text-[#FFD700] hover:bg-[#FFD700]/10 transition">
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[#FFD700]/15 pt-16 pb-10 overflow-hidden">
      {/* Glow bg */}
      <div className="absolute inset-0 opacity-25 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, #2A1200 0%, transparent 60%)' }}/>

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-12 border-b border-[#FFD700]/15">

          {/* Brand col */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <span className="grid place-items-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700]/15 to-[#FF6B00]/10 ring-1 ring-[#FFD700]/30">
                <Flame size={24}/>
              </span>
              <span className="font-serif text-[22px] font-extrabold tracking-tight text-[#FFD700]">
                Pattasu Plaza
              </span>
            </Link>
            <p className="text-[14px] text-[#BCAAA4] leading-relaxed max-w-[340px]">
              Sivakasi's finest fireworks — three generations of craftsmanship, delivered to your doorstep.
            </p>
            <div className="mt-5">
              <Ornament color="#FF6B00" width={180}/>
            </div>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2">
              <SocialBtn href="https://twitter.com">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1A4 4 0 0 0 12 8.5c0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.4-4.2-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4-.4.1-.7.2-1.1.2-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.9a8 8 0 0 1-5 1.7H2a11.4 11.4 0 0 0 6 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.1z"/>
                </svg>
              </SocialBtn>
              <SocialBtn href="https://instagram.com">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.9.9 1.4.2.5.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.5.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.5-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c0-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9.5-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 5.4a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm0 7.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6zm4.6-7.4a1 1 0 1 0 0-2.1 1 1 0 0 0 0 2.1z"/>
                </svg>
              </SocialBtn>
              <SocialBtn href="https://facebook.com">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </SocialBtn>
              <SocialBtn href="https://wa.me/919876543210">
                <IconWhatsApp size={14} color="#FFD700"/>
              </SocialBtn>
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Shop',    links: SHOP_LINKS    },
            { title: 'Support', links: SUPPORT_LINKS },
            { title: 'Company', links: COMPANY_LINKS },
          ].map(col => (
            <div key={col.title} className="md:col-span-2">
              <div className="text-[11px] tracking-[3px] uppercase font-bold text-[#FF6B00] mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href={`/${l.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                          className="text-[13.5px] text-[#BCAAA4] hover:text-[#FFD700] transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-2">
            <div className="text-[11px] tracking-[3px] uppercase font-bold text-[#FF6B00] mb-4">
              Newsletter
            </div>
            <p className="text-[13px] text-[#BCAAA4] mb-3 leading-relaxed">
              Diwali deals & new arrivals.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input type="email" placeholder="you@email.com"
                className="px-3 py-2.5 rounded-lg bg-[#13100C] border border-[#FFD700]/20 text-[13px] text-[#E8DDC9] placeholder-[#8D6E63] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"/>
              <button type="submit"
                className="px-3 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#D14600] text-white text-[13px] font-semibold transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap text-[11px] tracking-[2.5px] uppercase font-semibold text-[#8D6E63]">
            <span>EST. 1995 · Sivakasi</span>
            <span className="text-[#FF6B00]">·</span>
            <span>CCOE Licensed</span>
            <span className="text-[#FF6B00]">·</span>
            <span>Govt. Approved</span>
          </div>
          <div className="text-[12.5px] text-[#8D6E63]">
            © 2025 Pattasu Plaza · Made with{' '}
            <span className="text-[#FF6B00]">♥</span> in Sivakasi
          </div>
        </div>
      </div>
    </footer>
  )
}
