import Link from 'next/link'
export const metadata = {
  title: 'All Laptops — LaptopLifeSpan',
  description: 'Browse our full database of laptop models with detailed specs, OS compatibility, and upgrade options.',
}
import { supabase } from '@/lib/supabase'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
export const dynamic = 'force-dynamic'

export default async function LaptopsPage() {
  const { data: laptops, error } = await supabase
    .from('laptops')
    .select('*')
    .order('brand', { ascending: true })
    .order('model', { ascending: true })

  // Group laptops under their brand, preserving the sorted order.
  const byBrand = new Map()
  for (const laptop of laptops ?? []) {
    const brand = laptop.brand || 'Other'
    if (!byBrand.has(brand)) byBrand.set(brand, [])
    byBrand.get(brand).push(laptop)
  }

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 style={{color: '#102030'}} className="text-4xl font-bold mb-8">All Laptops</h2>

        {error && <p className="text-red-600">Error loading laptops.</p>}

        {!error && laptops?.length === 0 && (
          <p style={{color: '#2A3A4A'}}>No laptops in the database yet.</p>
        )}

        {[...byBrand.entries()].map(([brand, models]) => (
          <section key={brand} className="mb-12">
            <h3
              style={{color: '#102030', borderBottom: '2px solid #2A6EA8'}}
              className="text-2xl font-bold mb-5 pb-2"
            >
              {brand}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((laptop) => (
                <Link
                  key={laptop.id}
                  href={`/laptops/${laptop.slug}`}
                  className="rounded-xl p-6 transition hover:opacity-90"
                  style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
                >
                  <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
                  <h4 style={{color: '#102030'}} className="text-xl font-semibold mb-2">{laptop.model}</h4>
                  <div className="text-sm space-y-1" style={{color: '#243444'}}>
                    {laptop.cpu && <p>CPU: {laptop.cpu}</p>}
                    {laptop.ram_gb && <p>RAM: {laptop.ram_gb}GB</p>}
                    {laptop.year && <p>Year: {laptop.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  )
}