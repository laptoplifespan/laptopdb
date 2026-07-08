import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Footer from './components/Footer'
import Header from './components/Header'
import HeaderSearch from './components/HeaderSearch'

export const metadata = {
  title: 'LaptopLifeSpan — Find Your Laptop\'s Full Potential',
  description: 'Look up laptop specs, check operating system compatibility, and discover upgrade options to extend your laptop\'s lifespan.',
}

export const dynamic = 'force-dynamic'

const FEATURED_BRANDS = ['Acer', 'Apple', 'Asus', 'Dell', 'HP', 'Lenovo']

const card = { backgroundColor: '#A4B0BC', border: '1px solid #C4CED8' }

export default async function Home() {
  // Counts for the stats strip.
  const [{ count: laptopCount }, { count: configCount }, { count: osCount }] = await Promise.all([
    supabase.from('laptops').select('*', { count: 'exact', head: true }),
    supabase.from('configurations').select('*', { count: 'exact', head: true }),
    supabase.from('operating_systems').select('*', { count: 'exact', head: true }),
  ])

  // Brands present in the data, merged with the featured list (kept alphabetical).
  const { data: brandRows } = await supabase.from('laptops').select('brand')
  const brands = [...new Set([...FEATURED_BRANDS, ...((brandRows ?? []).map((r) => r.brand).filter(Boolean))])].sort()

  // Operating systems and a few laptops to explore.
  const { data: systems } = await supabase
    .from('operating_systems')
    .select('name, version, type, slug')
    .order('name', { ascending: true })

  const { data: laptops } = await supabase
    .from('laptops')
    .select('brand, model, slug, year')
    .order('year', { ascending: false })
    .order('brand', { ascending: true })
    .limit(6)

  const stats = [
    { value: laptopCount ?? 0, label: 'Laptop models' },
    { value: configCount ?? 0, label: 'Configurations' },
    { value: osCount ?? 0, label: 'Operating systems' },
  ]

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 style={{color: '#102030'}} className="text-5xl font-bold mb-5">Find Your Laptop&apos;s Full Potential</h1>
        <p style={{color: '#2A3A4A'}} className="text-xl mb-8 max-w-2xl mx-auto">
          Look up detailed specs, check which operating systems your laptop can run, and find upgrades to extend its lifespan.
        </p>
        <div className="max-w-xl mx-auto text-left">
          <HeaderSearch hero />
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <Link href="/laptops" style={{backgroundColor: '#2A6EA8', color: '#fff'}} className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-90">Browse Laptops</Link>
          <Link href="/os" style={{color: '#102030', border: '1px solid #3A5068'}} className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-70">Operating Systems</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} style={card} className="rounded-xl py-6 text-center">
              <div style={{color: '#2A6EA8'}} className="text-3xl md:text-4xl font-bold">{s.value}</div>
              <div style={{color: '#243444'}} className="text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by brand */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 style={{color: '#102030'}} className="text-2xl font-bold mb-5">Browse by brand</h2>
        <div className="flex flex-wrap gap-3">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/laptops/brand/${brand.toLowerCase()}`}
              style={{...card, color: '#102030', borderRadius: '9999px', padding: '10px 22px', fontWeight: 600}}
              className="transition hover:opacity-90"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by OS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 style={{color: '#102030'}} className="text-2xl font-bold">Browse by operating system</h2>
          <Link href="/os" style={{color: '#2A6EA8'}} className="text-sm hover:opacity-70">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {systems?.map((os) => (
            <Link key={os.slug} href={`/os/${os.slug}`} style={card} className="rounded-xl p-4 transition hover:opacity-90">
              <p style={{color: '#2A6EA8'}} className="text-xs font-medium mb-1">{os.type}</p>
              <h3 style={{color: '#102030'}} className="font-semibold">{os.name}</h3>
              {os.version && <p style={{color: '#243444'}} className="text-xs">{os.version}</p>}
            </Link>
          ))}
        </div>
      </section>

      {/* Explore laptops */}
      {laptops?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-5">
            <h2 style={{color: '#102030'}} className="text-2xl font-bold">Explore laptops</h2>
            <Link href="/laptops" style={{color: '#2A6EA8'}} className="text-sm hover:opacity-70">See all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laptops.map((laptop) => (
              <Link key={laptop.slug} href={`/laptops/${laptop.slug}`} style={card} className="rounded-xl p-6 transition hover:opacity-90">
                <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
                <h3 style={{color: '#102030'}} className="text-xl font-semibold">{laptop.model}</h3>
                {laptop.year && <p style={{color: '#243444'}} className="text-sm mt-1">{laptop.year}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/laptops" style={card} className="rounded-xl p-6 transition hover:opacity-90 block">
          <div className="text-3xl mb-4">💻</div>
          <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">Detailed Specs</h3>
          <p style={{color: '#243444'}}>Full hardware specifications and configurations for every laptop model.</p>
        </Link>
        <Link href="/os" style={card} className="rounded-xl p-6 transition hover:opacity-90 block">
          <div className="text-3xl mb-4">🟢</div>
          <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">OS Compatibility</h3>
          <p style={{color: '#243444'}}>See at a glance which operating systems each configuration can run.</p>
        </Link>
        <Link href="/laptops" style={card} className="rounded-xl p-6 transition hover:opacity-90 block">
          <div className="text-3xl mb-4">⚡</div>
          <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">Upgrade Guides</h3>
          <p style={{color: '#243444'}}>Find compatible RAM and storage upgrades to breathe new life into your machine.</p>
        </Link>
      </section>

      <Footer />
    </main>
  )
}
