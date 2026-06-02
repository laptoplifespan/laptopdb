import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
export default async function LaptopPage({ params }) {
  const { slug } = await params

  const { data: laptop } = await supabase
    .from('laptops')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!laptop) notFound()

  const { data: compatibilityData } = await supabase
    .from('compatibility')
    .select('*, operating_systems(*)')
    .eq('laptop_id', laptop.id)

  const { data: allOS } = await supabase
    .from('operating_systems')
    .select('*')
    .order('name', { ascending: true })

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
        <Link href="/laptops" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          ← Back to all laptops
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main specs */}
          <div className="flex-1">
            <p className="text-blue-400 font-medium mb-1">{laptop.brand}</p>
            <h1 className="text-4xl font-bold mb-8">{laptop.model}</h1>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-800">
                  {laptop.year && <tr><td className="py-3 text-gray-400 w-40">Year</td><td className="py-3">{laptop.year}</td></tr>}
                  {laptop.cpu && <tr><td className="py-3 text-gray-400">CPU</td><td className="py-3">{laptop.cpu}</td></tr>}
                  {laptop.ram_gb && <tr><td className="py-3 text-gray-400">RAM</td><td className="py-3">{laptop.ram_gb}GB</td></tr>}
                  {laptop.max_ram_gb && <tr><td className="py-3 text-gray-400">Max RAM</td><td className="py-3">{laptop.max_ram_gb}GB</td></tr>}
                  {laptop.storage && <tr><td className="py-3 text-gray-400">Storage</td><td className="py-3">{laptop.storage}</td></tr>}
                  {laptop.gpu && <tr><td className="py-3 text-gray-400">GPU</td><td className="py-3">{laptop.gpu}</td></tr>}
                  {laptop.display_inches && <tr><td className="py-3 text-gray-400">Display</td><td className="py-3">{laptop.display_inches}" {laptop.display_resolution}</td></tr>}
                  {laptop.weight_kg && <tr><td className="py-3 text-gray-400">Weight</td><td className="py-3">{laptop.weight_kg}kg</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* OS Compatibility Sidebar */}
          <div className="lg:w-72">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">OS Compatibility</h2>
              <div className="space-y-3">
                {allOS?.map((os) => {
                  const compat = compatibilityData?.find(c => c.os_id === os.id)
                  const isCompatible = compat?.compatible
                  const hasData = compat !== undefined

                  return (
                    <div key={os.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{os.name}</p>
                        {os.version && <p className="text-xs text-gray-500">{os.version}</p>}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        !hasData ? 'bg-gray-600' :
                        isCompatible ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-600 mt-4">
  <span className="inline-block w-2 h-2 rounded-full bg-gray-600 mr-1"></span> Unknown &nbsp;
  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span> Compatible &nbsp;
  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span> Incompatible
</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}