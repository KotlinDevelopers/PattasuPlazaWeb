import type { Metadata } from 'next'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title:       "Pattasu Plaza — Sivakasi's Finest Fireworks Online",
  description: 'Buy premium quality crackers & fireworks online. Direct from Sivakasi — retail, wholesale & bulk pricing. 500+ products, pan India delivery.',
}

export default function HomePage() {
  return (
    <>
      <Navbar/>
      <main>
        <HomeClient/>
      </main>
      <Footer/>
    </>
  )
}
