import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

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

  // Group this brand's laptops by year (newest first, "Unknown" last).
  const byYear = new Map()
  for (const laptop of laptops ?? []) {
    const year = laptop.year ?? 'Unknown'
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year).push(laptop)
  }
  const orderedYears = [...byYear.keys()].sort((a, b) => {
    if (a === 'Unknown') return 1
    if (b === 'Unknown') return -1
    return b - a
  })

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/laptops" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← All laptops
        </Link>

        <h2 style={{color: '#102030'}} className="text-4xl font-bold mb-8">{name} Laptops</h2>

        {(!laptops || laptops.length === 0) && (
          <p style={{color: '#2A3A4A'}} className="text-sm italic">No {name} models listed yet.</p>
        )}

        {orderedYears.map((year) => (
          <div key={year} className="mb-8">
            <h3 style={{color: '#102030', borderBottom: '2px solid #2A6EA8'}} className="text-2xl font-bold mb-5 pb-2">
              {year === 'Unknown' ? 'Year unknown' : year}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {byYear.get(year).map((laptop) => (
                <Link
                  key={laptop.id}
                  href={`/laptops/${laptop.slug}`}
                  className="rounded-xl p-6 transition hover:opacity-90"
                  style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
                >
                  <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
                  <h4 style={{color: '#102030'}} className="text-xl font-semibold">{laptop.model}</h4>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  )
}
