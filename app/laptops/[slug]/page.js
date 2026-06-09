import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: laptop } = await supabase
    .from('laptops')
    .select('brand, model, year, cpu')
    .eq('slug', slug)
    .single()

  if (!laptop) return { title: 'Laptop Not Found — LaptopLifeSpan' }

  return {
    title: `${laptop.brand} ${laptop.model} Specs & OS Compatibility — LaptopLifeSpan`,
    description: `Full specs for the ${laptop.brand} ${laptop.model}${laptop.year ? ` (${laptop.year})` : ''}. ${laptop.cpu ? `Powered by ${laptop.cpu}.` : ''} Check OS compatibility and upgrade options.`,
  }
}

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
        <Link href="/laptops" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← Back to all laptops
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main specs */}
          <div className="flex-1">
            <p style={{color: '#2A6EA8'}} className="font-medium mb-1">{laptop.brand}</p>
            <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-8">{laptop.model}</h1>

            <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
              <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Specifications</h2>
              <table className="w-full text-sm">
                <tbody>
                  {laptop.year && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3 w-40" style={{color: '#2A3A4A'}}>Year</td><td className="py-3" style={{color: '#102030'}}>{laptop.year}</td></tr>}
                  {laptop.cpu && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>CPU</td><td className="py-3" style={{color: '#102030'}}>{laptop.cpu}</td></tr>}
                  {laptop.ram_gb && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>RAM</td><td className="py-3" style={{color: '#102030'}}>{laptop.ram_gb}GB</td></tr>}
                  {laptop.max_ram_gb && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Max RAM</td><td className="py-3" style={{color: '#102030'}}>{laptop.max_ram_gb}GB</td></tr>}
                  {laptop.storage && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Storage</td><td className="py-3" style={{color: '#102030'}}>{laptop.storage}</td></tr>}
                  {laptop.gpu && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>GPU</td><td className="py-3" style={{color: '#102030'}}>{laptop.gpu}</td></tr>}
                  {laptop.display_inches && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Display</td><td className="py-3" style={{color: '#102030'}}>{laptop.display_inches}" {laptop.display_resolution}</td></tr>}
                  {laptop.weight_kg && <tr><td className="py-3" style={{color: '#2A3A4A'}}>Weight</td><td className="py-3" style={{color: '#102030'}}>{laptop.weight_kg}kg</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* OS Compatibility Sidebar */}
          <div className="lg:w-72">
            <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 sticky top-6">
              <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">OS Compatibility</h2>
              <div className="space-y-3">
                {allOS?.map((os) => {
                  const compat = compatibilityData?.find(c => c.os_id === os.id)
                  const isCompatible = compat?.compatible
                  const hasData = compat !== undefined

                  return (
                    <div key={os.id} className="flex items-center justify-between">
                      <div>
                        <p style={{color: '#102030'}} className="text-sm font-medium">{os.name}</p>
                        {os.version && <p style={{color: '#2A3A4A'}} className="text-xs">{os.version}</p>}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        !hasData ? 'bg-gray-400' :
                        isCompatible ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  )
                })}
              </div>
              <div className="text-xs mt-4 flex gap-3" style={{color: '#2A3A4A'}}>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span> Unknown</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500"></span> Compatible</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-500"></span> Incompatible</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}