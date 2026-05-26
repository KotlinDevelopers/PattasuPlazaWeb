'use client'
import { useFeaturedProducts, useCategories, useCombos, useBanners, useAppConfig } from '@/hooks/useFirestore'
import {
  HeroSection, TrustSection, BannerCarousel, CategoriesSection,
  OfferBannerSection, ProductsSection, CombosSection,
  HowItWorksSection, ShopInfoSection, TestimonialsSection,
} from '@/components/home/HomeSections'

export default function HomeClient() {
  const { products,   loading: pLoading } = useFeaturedProducts(8)
  const { categories, loading: cLoading } = useCategories()
  const { combos,     loading: coLoading } = useCombos(true)
  const { banners }                        = useBanners()
  const { config }                         = useAppConfig()

  return (
    <>
      <HeroSection       config={config}/>
      <TrustSection/>
      {banners.length > 0 && <BannerCarousel banners={banners}/>}
      <CategoriesSection categories={categories} loading={cLoading}/>
      <OfferBannerSection config={config}/>
      <ProductsSection   products={products}  loading={pLoading}/>
      <CombosSection     combos={combos}      loading={coLoading}/>
      <HowItWorksSection/>
      <ShopInfoSection   config={config}/>
      <TestimonialsSection/>
    </>
  )
}
