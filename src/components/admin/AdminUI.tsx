'use client'
import { cn } from '@/lib/utils'
import { X, Loader2, AlertTriangle, CheckCircle2, ChevronDown, Search } from 'lucide-react'
import { ORDER_STATUS_LABELS, OrderStatus } from '@/types'
import { formatPrice } from '@/lib/utils'

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#FFF8F0]">{title}</h1>
        {subtitle && <p className="text-sm text-[#8D6E63] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = '#FF6B00', icon }: {
  label: string; value: string | number; sub?: string; color?: string; icon?: React.ReactNode
}) {
  return (
    <div className="bg-[#13100C] rounded-xl border border-[#2A2015] p-4 flex items-center gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-lg grid place-items-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-[#8D6E63] font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-xl font-bold text-[#FFF8F0] mt-0.5">{value}</p>
        {sub && <p className="text-xs text-[#8D6E63] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', loading, disabled, type = 'button', className }: {
  children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'; loading?: boolean; disabled?: boolean; className?: string
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary:   'bg-[#FF6B00] hover:bg-[#D14600] text-white shadow-[0_4px_14px_rgba(255,107,0,0.35)]',
    secondary: 'bg-[#1A1A1A] hover:bg-[#2A2015] text-[#FFF8F0] border border-[#2A2015]',
    danger:    'bg-[#F44336]/15 hover:bg-[#F44336]/25 text-[#F44336] border border-[#F44336]/25',
    ghost:     'hover:bg-white/5 text-[#BCAAA4] hover:text-[#FFF8F0]',
    success:   'bg-[#1A7F3E]/20 hover:bg-[#1A7F3E]/30 text-[#4CAF50] border border-[#1A7F3E]/30',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      className={cn(base, sizes[size], variants[variant], className)}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, className, ...props }: {
  label?: string; error?: string; className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-[#BCAAA4]">{label}</label>}
      <input
        {...props}
        className={cn(
          'w-full bg-[#0A0A0A] border rounded-lg px-3 py-2 text-sm text-[#FFF8F0]',
          'placeholder:text-[#8D6E63] focus:outline-none transition',
          error
            ? 'border-[#F44336]/50 focus:border-[#F44336]'
            : 'border-[#2A2015] focus:border-[#FF6B00]',
          className
        )}
      />
      {error && <p className="text-xs text-[#F44336]">{error}</p>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ label, error, rows = 3, className, ...props }: {
  label?: string; error?: string; rows?: number; className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-[#BCAAA4]">{label}</label>}
      <textarea
        rows={rows}
        {...props}
        className={cn(
          'w-full bg-[#0A0A0A] border rounded-lg px-3 py-2 text-sm text-[#FFF8F0] resize-none',
          'placeholder:text-[#8D6E63] focus:outline-none transition',
          error ? 'border-[#F44336]/50 focus:border-[#F44336]' : 'border-[#2A2015] focus:border-[#FF6B00]',
          className
        )}
      />
      {error && <p className="text-xs text-[#F44336]">{error}</p>}
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ label, checked, onChange, subtitle }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; subtitle?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#FFF8F0]">{label}</p>
        {subtitle && <p className="text-xs text-[#8D6E63]">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
          checked ? 'bg-[#FF6B00]' : 'bg-[#2A2015]'
        )}
      >
        <span className={cn(
          'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, error, className, children, ...props }: {
  label?: string; error?: string; className?: string; children: React.ReactNode
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-[#BCAAA4]">{label}</label>}
      <select
        {...props}
        className={cn(
          'w-full bg-[#0A0A0A] border rounded-lg px-3 py-2 text-sm text-[#FFF8F0]',
          'focus:outline-none transition appearance-none cursor-pointer',
          error ? 'border-[#F44336]/50' : 'border-[#2A2015] focus:border-[#FF6B00]',
          className
        )}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#F44336]">{error}</p>}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative bg-[#13100C] border border-[#2A2015] rounded-2xl w-full shadow-2xl',
        'max-h-[90vh] overflow-y-auto',
        wide ? 'max-w-2xl' : 'max-w-lg'
      )}>
        <div className="sticky top-0 flex items-center justify-between p-5 border-b border-[#2A2015] bg-[#13100C] rounded-t-2xl">
          <h2 className="text-base font-bold text-[#FFF8F0]">{title}</h2>
          <button onClick={onClose} className="text-[#8D6E63] hover:text-[#FFF8F0] transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, danger }: {
  open: boolean; onClose: () => void; onConfirm: () => void
  title: string; message: string; danger?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#13100C] border border-[#2A2015] rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className={cn(
          'w-10 h-10 rounded-full grid place-items-center mb-4',
          danger ? 'bg-[#F44336]/15' : 'bg-[#FF6B00]/15'
        )}>
          <AlertTriangle size={20} className={danger ? 'text-[#F44336]' : 'text-[#FF6B00]'} />
        </div>
        <h3 className="text-base font-bold text-[#FFF8F0] mb-2">{title}</h3>
        <p className="text-sm text-[#8D6E63] mb-6">{message}</p>
        <div className="flex gap-3">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }} className="flex-1">
            Confirm
          </Btn>
        </div>
      </div>
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: OrderStatus }) {
  const { en, color, bg } = ORDER_STATUS_LABELS[status] ?? { en: status, color: '#888', bg: 'rgba(136,136,136,0.15)' }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color, background: bg }}>
      {en}
    </span>
  )
}

// ── Search Bar ────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search…' }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg pl-9 pr-3 py-2 text-sm text-[#FFF8F0] placeholder:text-[#8D6E63] focus:outline-none transition"
      />
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action }: {
  icon: string; title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-base font-semibold text-[#FFF8F0] mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-[#8D6E63] mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}

// ── Loading Spinner ───────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return <Loader2 size={20} className={cn('animate-spin text-[#FF6B00]', className)} />
}

// ── Section Card ──────────────────────────────────────────────────────────────
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[#13100C] rounded-xl border border-[#2A2015]', className)}>
      {children}
    </div>
  )
}

// ── Stock Badge ───────────────────────────────────────────────────────────────
export function StockBadge({ stockCount, stock }: { stockCount: number; stock: string }) {
  if (stock === 'out_of_stock' || stockCount === 0)
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F44336]/15 text-[#F44336]">Out of Stock</span>
  if (stockCount <= 10)
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF9800]/15 text-[#FF9800]">Low — {stockCount} left</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#4CAF50]/15 text-[#4CAF50]">In Stock</span>
}
