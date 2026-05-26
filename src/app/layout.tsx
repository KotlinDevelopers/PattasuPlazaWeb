import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display, Noto_Serif_Tamil } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster }       from 'react-hot-toast'
import AuthProvider      from '@/components/shared/AuthProvider'
import '@/styles/globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'], variable: '--font-sans', display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal','italic'],
})
const notoTamil = Noto_Serif_Tamil({
  subsets: ['tamil'], variable: '--font-tamil', display: 'swap', weight: ['500','600','700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pattasuplaza.com'),
  title: { default:"Pattasu Plaza — Sivakasi's Finest Fireworks", template:'%s | Pattasu Plaza' },
  description: "Buy premium quality crackers & fireworks online. Direct from Sivakasi — retail, wholesale & bulk pricing. 500+ products, pan India delivery.",
  keywords: ['fireworks online','crackers online','sivakasi fireworks','buy crackers online','diwali crackers','pattasu online','bulk fireworks','wholesale crackers'],
  openGraph: {
    type:'website', locale:'en_IN', url:'https://pattasuplaza.com', siteName:'Pattasu Plaza',
    title:"Pattasu Plaza — Sivakasi's Finest Fireworks",
    description:"Premium crackers & fireworks direct from Sivakasi.",
    images:[{ url:'/og-image.jpg', width:1200, height:630 }],
  },
  robots: { index:true, follow:true },
}

export const viewport: Viewport = {
  themeColor: [
    { media:'(prefers-color-scheme: light)', color:'#FAF0DC' },
    { media:'(prefers-color-scheme: dark)',  color:'#0A0A0A' },
  ],
  width:'device-width', initialScale:1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${jakarta.variable} ${playfair.variable} ${notoTamil.variable}`}>
      <body className={`${jakarta.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background:'#1A1A1A', color:'#FFF8F0',
                border:'1px solid rgba(255,215,0,0.2)',
                fontFamily:'var(--font-sans)',
              },
              success: { iconTheme:{ primary:'#FF6B00', secondary:'#FFF8F0' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
