// src/lib/brand.ts — Single source of truth for all brand tokens

export const BRAND = {
  // Colors
  saffron:    '#FF6B00',
  saffronDk:  '#D14600',
  saffronLt:  '#FF8C2A',
  gold:       '#FFD700',
  goldDeep:   '#B8860B',
  goldText:   '#7B4F00',
  goldLight:  '#FFE680',
  crimson:    '#8B0000',
  crimsonLt:  '#CC0000',

  // Dark theme
  darkBg:      '#0A0A0A',
  darkSurface: '#1A1A1A',
  darkCard:    '#13100C',
  darkBorder:  '#2A2015',
  darkDeep:    '#0F0907',

  // Light theme
  cream:      '#FAF0DC',
  creamDeep:  '#F3E3BD',
  creamLight: '#FFFDF7',

  // Text
  inkDark:    '#3D2810',
  inkMuted:   '#7B4F00',
  inkDim:     '#9E7A3A',
  inkFaint:   '#BCAAA4',
  inkGhost:   '#8D6E63',

  // Semantic
  success:    '#1A7F3E',
  whatsapp:   '#25D366',
  whatsappDk: '#1FB958',

  // Gradients (as CSS strings)
  heroGradient:    'radial-gradient(ellipse 90% 60% at 50% 35%, #2A1200 0%, #14080A 55%, #0A0A0A 100%)',
  saffronGradient: 'linear-gradient(to bottom, #FF8C2A, #FF6B00)',
  darkGradient:    'linear-gradient(110deg, #FF6B00 0%, #E64500 45%, #8B0000 100%)',
} as const

// Firework variant palettes (matches site-shared.jsx)
export const FIREWORK_PALETTES = {
  gold:    { c1: '#FFFBEA', c2: '#FFD700', c3: '#FF8C00', c4: '#FF6B00' },
  crimson: { c1: '#FFE9D6', c2: '#FF9C5A', c3: '#E04A1A', c4: '#8B0000' },
  cool:    { c1: '#E8F4FF', c2: '#A0C8FF', c3: '#3A6FCB', c4: '#1B3A78' },
  green:   { c1: '#EAFBE3', c2: '#9CE6B0', c3: '#3AAE5A', c4: '#0E5F2E' },
  rose:    { c1: '#FFE9F1', c2: '#FFB4D2', c3: '#E04A85', c4: '#8B1E4A' },
  violet:  { c1: '#F1E9FF', c2: '#C9B4FF', c3: '#7B57E6', c4: '#3E1E8B' },
} as const

export type FireworkVariant = keyof typeof FIREWORK_PALETTES

// Category config
export const CATEGORIES = [
  { slug: 'sparklers',    name: 'Sparklers',     tamil: 'மத்தாப்பு',      icon: '✨', variant: 'gold'    as FireworkVariant, count: 24 },
  { slug: 'flower-pots', name: 'Flower Pots',   tamil: 'பூச்சாட்டி',    icon: '🌸', variant: 'crimson' as FireworkVariant, count: 18 },
  { slug: 'chakkars',    name: 'Chakkars',       tamil: 'சக்கரம்',        icon: '🌀', variant: 'rose'    as FireworkVariant, count: 12 },
  { slug: 'rockets',     name: 'Rockets',        tamil: 'ராக்கெட்',      icon: '🚀', variant: 'cool'    as FireworkVariant, count: 16 },
  { slug: 'aerial-shots',name: 'Aerial Shots',   tamil: 'வான வேட்டு',   icon: '🎆', variant: 'violet'  as FireworkVariant, count: 32 },
  { slug: 'gift-boxes',  name: 'Gift Boxes',     tamil: 'பரிசு பெட்டி', icon: '🎁', variant: 'green'   as FireworkVariant, count: 9  },
  { slug: 'kids-safe',   name: 'Kids Safe',      tamil: 'குழந்தை பாதுகாப்பு', icon: '👶', variant: 'gold' as FireworkVariant, count: 15 },
  { slug: 'combos',      name: 'Combo Packs',    tamil: 'காம்போ பேக்',  icon: '📦', variant: 'crimson' as FireworkVariant, count: 22 },
] as const

// WhatsApp number
export const WHATSAPP_NUMBER = '919876543210'
export const PHONE_NUMBER    = '+91 98765 43210'
export const EMAIL           = 'hello@pattasuplaza.in'
export const ADDRESS         = '42, Anaikuttam Main Road, Near New Bus Stand, Sivakasi, Tamil Nadu 626123'
export const MIN_ORDER       = 2000
export const DIWALI_DATE     = '2025-11-05T23:59:59'
