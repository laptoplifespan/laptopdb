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

const card = { backgroundColor: '#A4B0BC', border: '1px solid #C4CED8' }

export default async function Home() {
  // Counts for the stats strip.
  const [{ count: laptopCount }, { count: configCount }, { count: osCount }] = await Promise.all([
    supabase.from('laptops').select('*', { count: 'exact', head: true }),
    supabase.from('configurations').select('*', { count: 'exact', head: true }),
    supabase.from('operating_systems').select('*', { count: 'exact', head: true }),
  ])

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
          <Link href="/os" style={{backgroundColor: '#2A6EA8', color: '#fff'}} className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-90">Operating Systems</Link>
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
