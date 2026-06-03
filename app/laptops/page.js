import Link from 'next/link'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
export default async function LaptopsPage() {
  const { data: laptops, error } = await supabase
    .from('laptops')
    .select('*')
    .order('brand', { ascending: true })

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-400">LaptopLifeSpan</Link>
          <nav className="flex gap-6 text-gray-300">
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/os" className="hover:text-white transition">Operating Systems</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-8">All Laptops</h2>

        {error && <p className="text-red-400">Error loading laptops.</p>}

        {!error && laptops?.length === 0 && (
          <p className="text-gray-400">No laptops in the database yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laptops?.map((laptop) => (
            <Link
              key={laptop.id}
              href={`/laptops/${laptop.slug}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition"
            >
              <p className="text-sm text-blue-400 font-medium mb-1">{laptop.brand}</p>
              <h3 className="text-xl font-semibold mb-2">{laptop.model}</h3>
              <div className="text-gray-400 text-sm space-y-1">
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