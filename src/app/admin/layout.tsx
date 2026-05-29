import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin — Pattasu Plaza', template: '%s | Admin · Pattasu Plaza' },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
