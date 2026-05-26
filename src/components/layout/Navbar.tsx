'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, ShoppingCart, Menu, X } from 'lucide-react'
import { Flame, IconWhatsApp } from '@/components/shared/Firework'
import { useCartStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home',     href: '/'        },
  { label: 'Shop',     href: '/shop'    },
  { label: 'Combos',   href: '/shop?category=combos' },
  { label: 'About',    href: '/about'   },
  { label: 'Contact',  href: '/contact' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [mounted,     setMounted]     = useState(false)
  const { theme, setTheme }           = useTheme()
  const totalQty                      = useCartStore(s => s.totalQty())

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#FFD700]/25 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
        : 'bg-[#0A0A0A]/55 backdrop-blur-sm border-b border-[#FFD700]/12'
    )}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#FFD700]/15 to-[#FF6B00]/10 ring-1 ring-[#FFD700]/30">
            <Flame size={22}/>
          </span>
          <span className="font-serif text-[20px] font-extrabold tracking-tight text-[#FFD700]">
            Pattasu Plaza
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((l, i) => (
            <Link key={l.href} href={l.href}
              className={cn(
                'px-4 py-2 text-[14px] font-medium tracking-wide transition-colors rounded-lg hover:text-[#FFD700]',
                i === 0 ? 'text-[#FFD700]' : 'text-[#E8DDC9]'
              )}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="grid place-items-center w-9 h-9 rounded-full border border-[#FFD700]/25 text-[#FFD700] hover:bg-[#FFD700]/10 transition">
              {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
          )}

          {/* WhatsApp */}
          <a href="https://wa.me/919876543210"
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#1FB958] text-white text-[13px] font-semibold shadow-[0_4px_18px_rgba(37,211,102,0.35)] transition-all">
            <IconWhatsApp size={16}/>
            <span>WhatsApp</span>
          </a>

          {/* Cart */}
          <Link href="/cart"
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#FF6B00] text-[#FF8C2A] hover:bg-[#FF6B00] hover:text-white text-[13px] font-semibold transition-all">
            <ShoppingCart size={14}/>
            <span>Cart</span>
            {totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid place-items-center w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-bold">
                {totalQty > 99 ? '99+' : totalQty}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative grid place-items-center w-10 h-10 text-[#FFD700]">
            <ShoppingCart size={20}/>
            {totalQty > 0 && (
              <span className="absolute top-0.5 right-0.5 grid place-items-center w-4.5 h-4.5 rounded-full bg-[#FF6B00] text-white text-[9px] font-bold">
                {totalQty}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(o => !o)}
            className="grid place-items-center w-10 h-10 rounded-lg border border-[#FFD700]/25 text-[#FFD700]">
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A]/96 backdrop-blur-md border-t border-[#FFD700]/15 px-5 py-4">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[15px] font-medium text-[#E8DDC9] border-b border-[#FFD700]/8 hover:text-[#FFD700] transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-4">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                 className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-full bg-[#25D366] text-white text-[13px] font-semibold">
                <IconWhatsApp size={16}/> WhatsApp
              </a>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-[#FFD700]/25 text-[#FFD700] text-[13px] font-semibold">
                  {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
