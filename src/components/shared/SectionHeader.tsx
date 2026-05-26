import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?:    string
  title:       string
  italicWord?: string
  subtitle?:   string
  dark?:       boolean
  action?:     React.ReactNode
  className?:  string
}

export function SectionHeader({
  eyebrow, title, italicWord, subtitle, dark = false, action, className,
}: SectionHeaderProps) {
  const ink   = dark ? '#FFD700'  : '#7B4F00'
  const muted = dark ? '#BCAAA4' : '#9E7A3A'

  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-10', className)}>
      <div className="reveal max-w-[640px]">
        {eyebrow && (
          <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-3 text-[#FF6B00]">
            {eyebrow}
          </div>
        )}
        <h2
          className="font-extrabold leading-[1.05] tracking-tight text-[34px] md:text-[44px]"
          style={{ fontFamily: '"Playfair Display", serif', color: ink }}>
          {title}{' '}
          {italicWord && (
            <em
              className="font-extrabold"
              style={{ fontStyle: 'italic', color: dark ? '#FF8C2A' : '#D14600' }}>
              {italicWord}
            </em>
          )}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[15px] leading-relaxed max-w-[540px]" style={{ color: muted }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="reveal">{action}</div>}
    </div>
  )
}
