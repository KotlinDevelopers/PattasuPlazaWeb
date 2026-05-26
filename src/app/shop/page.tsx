'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, Tag } from 'lucide-react'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import { ProductCard, SkeletonCard } from '@/components/home/HomeSections'
import { Firework, Sparkles } from '@/components/shared/Firework'
import { useProducts, useCategories, useAppConfig } from '@/hooks/useFirestore'
import { formatINR } from '@/lib/utils'
import type { Product } from '@/types'

const SORT_OPTIONS = [
  { label:'Featured',        value:'featured'   },
  { label:'Price: Low–High', value:'price_asc'  },
  { label:'Price: High–Low', value:'price_desc' },
  { label:'Biggest Discount',value:'discount'   },
  { label:'Name A–Z',        value:'name_asc'   },
]

function ShopContent() {
  const searchParams  = useSearchParams()
  const initCat       = searchParams.get('category') || ''
  const initFilter    = searchParams.get('filter')   || ''

  const [search,      setSearch]     = useState('')
  const [selectedCat, setSelectedCat]= useState(initCat)
  const [sort,        setSort]       = useState('featured')
  const [showFilter,  setShowFilter] = useState(false)
  const [maxPrice,    setMaxPrice]   = useState(5000)
  const [offersOnly,  setOffersOnly] = useState(initFilter === 'offers')

  const { products, loading }    = useProducts()
  const { categories }           = useCategories()
  const { config }               = useAppConfig()
  const minOrder = config?.minimumOrderValue || 2000

  const filtered = useMemo(() => {
    let r = [...products]
    if (search)      r = r.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.nameTamil?.includes(search))
    if (selectedCat) r = r.filter(p => p.categoryId === selectedCat)
    if (offersOnly)  r = r.filter(p => p.isOffer)
    r = r.filter(p => p.retailPrice <= maxPrice)
    switch (sort) {
      case 'price_asc':  r.sort((a,b) => a.retailPrice - b.retailPrice); break
      case 'price_desc': r.sort((a,b) => b.retailPrice - a.retailPrice); break
      case 'discount':   r.sort((a,b) => b.offerPercent - a.offerPercent); break
      case 'name_asc':   r.sort((a,b) => a.name.localeCompare(b.name)); break
      default:           r.sort((a,b) => Number(b.isFeatured) - Number(a.isFeatured))
    }
    return r
  }, [products, search, selectedCat, sort, offersOnly, maxPrice])

  const clearAll = () => { setSearch(''); setSelectedCat(''); setOffersOnly(false); setMaxPrice(5000) }
  const hasFilters = search || selectedCat || offersOnly || maxPrice < 5000

  return (
    <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">

      {/* Hero */}
      <div className="relative bg-[#0A0A0A] py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
        <Sparkles count={30} seed={5}/>
        <div className="absolute right-5 md:right-16 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
          <Firework size={220} variant="gold"/>
        </div>
        <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="text-[11px] tracking-[3px] uppercase font-semibold text-[#FF6B00] mb-3">500+ Products</div>
          <h1 className="text-[#FFD700] font-extrabold text-[42px] md:text-[56px] leading-tight"
              style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
            Shop Fireworks
          </h1>
          <p className="text-[#BCAAA4] text-[15px] mt-2 max-w-[480px]">
            Direct from Sivakasi — retail, wholesale & bulk pricing. Min order ₹{formatINR(minOrder)}.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8">

        {/* Search + controls row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E7A3A]" size={16}/>
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search crackers, sparklers, combos…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#9E7A3A] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"/>
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E7A3A] hover:text-[#FF6B00]">
                <X size={14}/>
              </button>
            )}
          </div>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] focus:outline-none focus:border-[#FF6B00] transition cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E7A3A] pointer-events-none"/>
          </div>
          <button onClick={() => setShowFilter(f => !f)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[14px] font-medium transition ${
              showFilter ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-white dark:bg-[#1A1A1A] border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4]'
            }`}>
            <SlidersHorizontal size={15}/> Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-[#FF6B00]"/>}
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }} className="overflow-hidden mb-5">
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E9D9B4] dark:border-[#2A2015]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* On sale */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setOffersOnly(o => !o)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${offersOnly ? 'bg-[#FF6B00]' : 'bg-[#E9D9B4] dark:bg-[#2A2015]'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${offersOnly ? 'left-5' : 'left-1'}`}/>
                    </div>
                    <span className="text-[14px] font-medium text-[#3D2810] dark:text-[#FFF8F0]">On Sale Only</span>
                  </label>
                  {/* Price range */}
                  <div className="sm:col-span-1">
                    <div className="text-[12px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-2">
                      Max Price: ₹{formatINR(maxPrice)}
                    </div>
                    <input type="range" min="100" max="5000" step="100" value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#FF6B00]"/>
                    <div className="flex justify-between text-[11px] text-[#9E7A3A] mt-1">
                      <span>₹100</span><span>₹5,000</span>
                    </div>
                  </div>
                  {/* Clear */}
                  {hasFilters && (
                    <button onClick={clearAll} className="text-[13px] text-[#D14600] font-semibold hover:underline text-left flex items-center gap-1.5">
                      <X size={14}/> Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-5 overflow-x-auto pb-1">
          <button onClick={() => setSelectedCat('')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
              !selectedCat ? 'bg-[#FF6B00] text-white shadow-[0_4px_14px_rgba(255,107,0,0.35)]'
                : 'bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4] hover:border-[#FF6B00]/50'}`}>
            All ({products.length})
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id === selectedCat ? '' : cat.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat.id ? 'bg-[#FF6B00] text-white shadow-[0_4px_14px_rgba(255,107,0,0.35)]'
                  : 'bg-white dark:bg-[#1A1A1A] border border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4] hover:border-[#FF6B00]/50'}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[13px] text-[#9E7A3A]">
            {loading ? 'Loading products…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          {hasFilters && (
            <button onClick={clearAll} className="text-[12px] text-[#D14600] hover:underline font-medium flex items-center gap-1">
              <X size={12}/> Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-[22px] font-extrabold text-[#7B4F00] dark:text-[#FFD700] mb-2">No products found</h3>
            <p className="text-[#9E7A3A] mb-6">Try adjusting your search or filters</p>
            <button onClick={clearAll}
              className="px-6 py-2.5 rounded-xl bg-[#FF6B00] text-white font-semibold text-[14px] hover:bg-[#D14600] transition">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div key={p.id} layout
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.9 }} transition={{ duration:0.25, delay: i < 8 ? i*0.03 : 0 }}>
                  <ProductCard product={p} index={i}/>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <div className="h-16"/>
      </div>
    </main>
  )
}

export default function ShopPage() {
  return (
    <>
      <Navbar/>
      <Suspense fallback={<div className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]"/>}>
        <ShopContent/>
      </Suspense>
      <Footer/>
    </>
  )
}
