'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/store'
import { checkIsAdmin } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ShoppingBag, Package, Tag,
  Gift, Image, Settings, BarChart3,
  LogOut, Menu, X, ChevronRight, Flame,
  AlertTriangle, Boxes,
} from 'lucide-react'

const NAV = [
  { href: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/orders',     label: 'Orders',      icon: ShoppingBag     },
  { href: '/admin/products',   label: 'Products',    icon: Package         },
  { href: '/admin/categories', label: 'Categories',  icon: Tag             },
  { href: '/admin/combos',     label: 'Combos',      icon: Gift            },
  { href: '/admin/banners',    label: 'Banners',     icon: Image           },
  { href: '/admin/stock',      label: 'Stock',       icon: Boxes           },
  { href: '/admin/config',     label: 'Config',      icon: Settings        },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router    = useRouter()
  const pathname  = usePathname()
  const { user }  = useAuthStore()
  const [checked,    setChecked]    = useState(false)
  const [isAdmin,    setIsAdmin]    = useState(false)
  const [sideOpen,   setSideOpen]   = useState(false)

  useEffect(() => {
    if (!user) { router.replace('/admin'); return }
    checkIsAdmin(user.uid).then(ok => {
      if (!ok) { router.replace('/admin'); return }
      setIsAdmin(true)
      setChecked(true)
    })
  }, [user, router])

  const handleSignOut = async () => {
    await signOut(auth)
    router.replace('/admin')
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-saffron border-t-transparent animate-spin" />
          <p className="text-sm text-[#8D6E63]">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">

      {/* ── Mobile overlay ── */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-[#13100C] border-r border-[#2A2015] z-40',
        'flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        sideOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#2A2015]">
          <div className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FF6B00]/15 ring-1 ring-[#FFD700]/30">
            <Flame size={16} className="text-[#FFD700]" />
          </div>
          <div>
            <p className="font-serif font-bold text-[#FFD700] text-sm leading-tight">Pattasu Plaza</p>
            <p className="text-[10px] text-[#8D6E63] uppercase tracking-wider">Admin Panel</p>
          </div>
          <button className="ml-auto lg:hidden text-[#8D6E63]" onClick={() => setSideOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSideOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[#FF6B00]/15 text-[#FF6B00] ring-1 ring-[#FF6B00]/25'
                    : 'text-[#BCAAA4] hover:text-[#FFF8F0] hover:bg-white/5'
                )}
              >
                <Icon size={17} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* User + sign out */}
        <div className="border-t border-[#2A2015] p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 grid place-items-center text-xs font-bold text-[#FF6B00]">
              {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#FFF8F0] truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-[#8D6E63] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#F44336] hover:bg-[#F44336]/10 transition"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-20 flex items-center gap-3 h-14 px-4 bg-[#0A0A0A]/90 backdrop-blur border-b border-[#2A2015] lg:hidden">
          <button onClick={() => setSideOpen(true)} className="text-[#BCAAA4]">
            <Menu size={22} />
          </button>
          <span className="font-serif font-bold text-[#FFD700] text-sm">Pattasu Plaza Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
