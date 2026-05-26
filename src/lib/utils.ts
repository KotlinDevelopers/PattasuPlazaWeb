// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { WHATSAPP_NUMBER, MIN_ORDER } from './brand'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format INR price
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
}

// Format plain number in INR style
export function formatINR(amount: number): string {
  return amount.toLocaleString('en-IN')
}

// Countdown calculator
export function calcCountdown(targetISO: string) {
  const ms   = Math.max(0, new Date(targetISO).getTime() - Date.now())
  const d    = Math.floor(ms / 86400000)
  const h    = Math.floor((ms % 86400000) / 3600000)
  const m    = Math.floor((ms % 3600000) / 60000)
  const s    = Math.floor((ms % 60000) / 1000)
  return { d, h, m, s }
}

// Pad number to 2 digits
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

// WhatsApp order link builder
export function buildWhatsAppOrderLink(items: Array<{ name: string; qty: number; price: number }>): string {
  const lines = items.map(i => `• ${i.name} ×${i.qty} — ₹${formatINR(i.price * i.qty)}`).join('\n')
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const msg   = `Hi! I'd like to order from Pattasu Plaza:\n\n${lines}\n\nTotal: ₹${formatINR(total)}\n\nKindly confirm availability and delivery details.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

// Disc percent
export function discountPercent(price: number, mrp: number): number {
  return Math.round((1 - price / mrp) * 100)
}

// Seeded random (same as site-shared.jsx)
export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

// Extract YouTube ID
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?#]+)/,
    /[?&]v=([^&#]+)/,
    /youtube\.com\/shorts\/([^?#]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

// Truncate text
export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '…' : str
}

// Initials from name
export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// Check minimum order met
export function isMinOrderMet(subtotal: number): boolean {
  return subtotal >= MIN_ORDER
}
