import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function LaptopsPage() {
  const { data: laptops, error } = await supabase
    .from('laptops')
    .select('*')
    .order('brand', { ascending: true })

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <header style={{backgroundColor: '#1E2E3E'}} className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/laptoplifespan-logo.svg" alt="LaptopLifeSpan" width={340} height={60} priority />
          </Link>
          <nav className="flex gap-6" style={{color: '#A8C0D4'}}>
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/os" className="hover:text-white transition">Operating Systems</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 style={{color: '#102030'}} className="text-4xl font-bold mb-8">All Laptops</h2>

        {error && <p className="text-red-600">Error loading laptops.</p>}

        {!error && laptops?.length === 0 && (
          <p style={{color: '#2A3A4A'}}>No laptops in the database yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laptops?.map((laptop) => (
            <Link
              key={laptop.id}
              href={`/laptops/${laptop.slug}`}
              className="rounded-xl p-6 transition hover:opacity-90"
              style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
            >
              <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
              <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">{laptop.model}</h3>
              <div className="text-sm space-y-1" style={{color: '#243444'}}>
                {laptop.cpu && <p>CPU: {laptop.cpu}</p>}
                {laptop.ram_gb && <p>RAM: {laptop.ram_gb}GB</p>}
                {laptop.year && <p>Year: {laptop.year}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}