'use client'
import { useId } from 'react'
import { FIREWORK_PALETTES, type FireworkVariant } from '@/lib/brand'

interface FireworkProps {
  size?:    number
  variant?: FireworkVariant
  glow?:    boolean
}

export function Firework({ size = 200, variant = 'gold', glow = true }: FireworkProps) {
  const uid = useId().replace(/:/g, '')
  const p   = FIREWORK_PALETTES[variant]
  const N   = 28
  const rays = Array.from({ length: N }, (_, i) => (i * 360) / N)

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`fwc-${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor={p.c1} stopOpacity="1"/>
          <stop offset="30%"  stopColor={p.c2} stopOpacity="0.9"/>
          <stop offset="65%"  stopColor={p.c3} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={p.c4} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`fwr-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={p.c2} stopOpacity="0.95"/>
          <stop offset="55%"  stopColor={p.c2} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={p.c4} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id={`fwra-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={p.c3} stopOpacity="0.85"/>
          <stop offset="60%"  stopColor={p.c3} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={p.c4} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <g transform="translate(100 100)">
        {glow && (
          <circle r="92" fill={`url(#fwc-${uid})`} opacity="0.45"/>
        )}
        {rays.map((deg, i) => {
          const long = i % 2 === 0
          const len  = long ? 82 : 60
          const grad = long ? `fwr-${uid}` : `fwra-${uid}`
          return (
            <g key={i} transform={`rotate(${deg})`}>
              <line x1="0" y1="14" x2="0" y2={len}
                stroke={`url(#${grad})`}
                strokeWidth={long ? 1.7 : 1.1}
                strokeLinecap="round"/>
              <circle cx="0" cy={len} r={long ? 2.6 : 1.7} fill={long ? p.c2 : p.c3}/>
              {long && <circle cx="0" cy={len + 6} r="1" fill={p.c4} opacity="0.55"/>}
            </g>
          )
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const deg = (i * 360) / 14 + 12.86
          return (
            <g key={i} transform={`rotate(${deg})`}>
              <line x1="0" y1="6" x2="0" y2="34"
                stroke={p.c1} strokeWidth="0.9" strokeOpacity="0.7" strokeLinecap="round"/>
              <circle cx="0" cy="34" r="1.4" fill={p.c1} opacity="0.9"/>
            </g>
          )
        })}
        <circle r="16" fill={p.c2} opacity="0.55"/>
        <circle r="9"  fill={p.c1}/>
        <circle r="3.5" fill="#fff"/>
      </g>
    </svg>
  )
}

// ── Flame logo mark ───────────────────────────────────────
export function Flame({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="flame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFD700"/>
          <stop offset="55%"  stopColor="#FF8C00"/>
          <stop offset="100%" stopColor="#D14600"/>
        </linearGradient>
      </defs>
      <path
        d="M16 2c1 5-4 7-4 12 0 3 2 5 4 5s4-2 4-5c0-2-1-3-1-5 2 1 5 4 5 9 0 5-4 9-9 9s-9-4-9-9c0-5 4-9 10-16z"
        fill="url(#flame-grad)"
      />
      <path
        d="M16 14c1 2-2 3-2 6 0 2 1 3 2 3s2-1 2-3c0-1-1-2 0-3 1 1 2 2 2 4 0 3-2 5-4 5s-4-2-4-5c0-3 2-5 4-7z"
        fill="#FFE680" opacity="0.85"
      />
    </svg>
  )
}

// ── Ornament divider line ─────────────────────────────────
export function Ornament({ color = '#FF6B00', width = 220 }: { color?: string; width?: number }) {
  return (
    <svg width={width} height="14" viewBox="0 0 220 14" fill="none">
      <line x1="0" y1="7" x2="92" y2="7" stroke={color} strokeOpacity="0.45"/>
      <circle cx="100" cy="7" r="1.6" fill={color} opacity="0.55"/>
      <path d="M110 7 L115 2 L120 7 L115 12 Z" fill={color}/>
      <circle cx="128" cy="7" r="1.6" fill={color} opacity="0.55"/>
      <line x1="128" y1="7" x2="220" y2="7" stroke={color} strokeOpacity="0.45"/>
    </svg>
  )
}

// ── WhatsApp icon ─────────────────────────────────────────
export function IconWhatsApp({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19.05 4.91A10 10 0 0 0 4.07 18l-1.4 5 5.13-1.34A10 10 0 1 0 19.05 4.91zm-7.07 15.32a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.04.8.81-2.96-.2-.31a8.32 8.32 0 1 1 6.96 3.81zm4.57-6.23c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.98-.14.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42l-.47-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.08 0 1.23.9 2.41 1.03 2.58.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.59.1.49-.07 1.48-.6 1.69-1.19.21-.59.21-1.09.15-1.19-.06-.1-.23-.17-.48-.3z"/>
    </svg>
  )
}

// ── Star icon ─────────────────────────────────────────────
export function IconStar({ size = 14, filled = true }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#FFB300' : '#E0D6C2'}>
      <path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73 1.64 7.03z"/>
    </svg>
  )
}

// ── Sparkles field ────────────────────────────────────────
export function Sparkles({ count = 40, seed = 7 }: { count?: number; seed?: number }) {
  const items = (() => {
    let s = seed
    const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
    return Array.from({ length: count }, (_, i) => ({
      id:    i,
      left:  r() * 100,
      top:   r() * 100,
      size:  1 + r() * 2.5,
      delay: r() * 4,
      dur:   2 + r() * 3,
      hue:   r() > 0.5 ? '#FFD700' : '#FF8C00',
    }))
  })()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(it => (
        <span key={it.id} className="pp-sparkle" style={{
          left: `${it.left}%`, top: `${it.top}%`,
          width: it.size, height: it.size, background: it.hue,
          animationDelay: `${it.delay}s`, animationDuration: `${it.dur}s`,
          boxShadow: `0 0 ${it.size * 4}px ${it.hue}`,
        }}/>
      ))}
    </div>
  )
}

// ── Rising particle field ─────────────────────────────────
export function ParticleField({ count = 18, seed = 13 }: { count?: number; seed?: number }) {
  const items = (() => {
    let s = seed
    const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
    const g = ['✨', '✦', '✧', '·', '✨']
    return Array.from({ length: count }, (_, i) => ({
      id:    i,
      g:     g[Math.floor(r() * g.length)],
      left:  r() * 100,
      size:  10 + r() * 12,
      op:    0.25 + r() * 0.35,
      dur:   9 + r() * 8,
      delay: -r() * 16,
      drift: (r() - 0.5) * 70,
    }))
  })()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(p => (
        <span key={p.id} className="pp-rise" style={{
          left: `${p.left}%`,
          fontSize: p.size, color: '#FFD700',
          ['--pp-op' as any]: p.op,
          ['--pp-drift' as any]: `${p.drift}px`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          filter: 'drop-shadow(0 0 4px rgba(255,180,80,0.55))',
        }}>{p.g}</span>
      ))}
    </div>
  )
}
