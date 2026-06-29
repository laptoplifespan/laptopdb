import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import SpecsTable from '@/app/components/SpecsTable'
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

// Turns plain text into React nodes with any http(s) URLs rendered as clickable links.
function linkify(text) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer"
         style={{color: '#2A6EA8', textDecoration: 'underline'}}>
        {part}
      </a>
    ) : (
      part
    )
  )
}

export default async function LaptopPage({ params }) {
  const { slug } = await params

  const { data: laptop } = await supabase
    .from('laptops')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!laptop) notFound()

  const { data: configs } = await supabase
    .from('configurations')
    .select('*')
    .eq('laptop_id', laptop.id)
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true })

  const { data: compatibilityData } = await supabase
    .from('compatibility')
    .select('os_id, compatible')
    .eq('laptop_id', laptop.id)

  const { data: allOS } = await supabase
    .from('operating_systems')
    .select('*')
    .order('name', { ascending: true })

  const compatMap = new Map(
    compatibilityData?.map(c => [String(c.os_id), c.compatible]) ?? []
  )

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/laptops" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← Back to all laptops
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main specs */}
          <div className="flex-1">
            <p style={{color: '#2A6EA8'}} className="font-medium mb-1">{laptop.brand}</p>
            <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-8">{laptop.model}</h1>

            <SpecsTable laptop={laptop} configs={configs} />

            {/* Description */}
            <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 mt-6">
              <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Description</h2>
              {laptop.description ? (
                <p style={{color: '#243444'}} className="leading-relaxed whitespace-pre-line">{laptop.description}</p>
              ) : (
                <p style={{color: '#2A3A4A'}} className="text-sm italic">No description added yet.</p>
              )}
            </div>

            {/* Upgrade Path */}
            <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 mt-6">
              <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Upgrade Path</h2>
              {laptop.upgrade_path ? (
                <p style={{color: '#243444'}} className="leading-relaxed whitespace-pre-line">{linkify(laptop.upgrade_path)}</p>
              ) : (
                <p style={{color: '#2A3A4A'}} className="text-sm italic">No upgrade recommendations added yet.</p>
              )}
            </div>
          </div>

          {/* OS Compatibility Sidebar */}
          <div className="lg:w-72">
            <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 sticky top-6">
              <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">OS Compatibility</h2>
              <div className="space-y-3">
                {allOS?.map((os) => {
                  const hasData = compatMap.has(String(os.id))
                  const isCompatible = compatMap.get(String(os.id))

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
      <Footer />
    </main>
  )
}