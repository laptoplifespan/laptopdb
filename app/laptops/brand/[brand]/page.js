import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import BrandLaptops from '@/app/components/BrandLaptops'

export const dynamic = 'force-dynamic'

// Brands that always have a page, even before any models are added.
const FEATURED_BRANDS = ['Acer', 'Apple', 'Asus', 'Dell', 'HP', 'Lenovo']

// Resolve the URL param (e.g. "hp") to the proper brand display name (e.g. "HP"),
// preferring the actual stored brand, falling back to the featured list.
function resolveBrandName(param, laptops) {
  if (laptops && laptops.length > 0) return laptops[0].brand
  return FEATURED_BRANDS.find((b) => b.toLowerCase() === param.toLowerCase()) ?? null
}

export async function generateMetadata({ params }) {
  const { brand } = await params
  const { data: laptops } = await supabase
    .from('laptops')
    .select('brand')
    .ilike('brand', brand)
    .limit(1)

  const name = resolveBrandName(brand, laptops)
  if (!name) return { title: 'Brand Not Found — LaptopLifeSpan' }

  return {
    title: `${name} Laptops — Specs & OS Compatibility — LaptopLifeSpan`,
    description: `Browse ${name} laptop models with detailed specifications, OS compatibility, and upgrade options.`,
  }
}

export default async function BrandPage({ params }) {
  const { brand } = await params

  const { data: laptops } = await supabase
    .from('laptops')
    .select('*')
    .ilike('brand', brand)
    .order('year', { ascending: false })
    .order('model', { ascending: true })

  const name = resolveBrandName(brand, laptops)

  // Unknown brand with no models → 404
  if (!name) notFound()

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/laptops" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← All laptops
        </Link>

        <h2 style={{color: '#102030'}} className="text-4xl font-bold mb-8">{name} Laptops</h2>

        {(!laptops || laptops.length === 0) ? (
          <p style={{color: '#2A3A4A'}} className="text-sm italic">No {name} models listed yet.</p>
        ) : (
          <BrandLaptops laptops={laptops} />
        )}
      </div>
      <Footer />
    </main>
  )
}
