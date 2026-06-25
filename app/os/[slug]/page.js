import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: os } = await supabase
    .from('operating_systems')
    .select('name, version, type')
    .eq('slug', slug)
    .single()

  if (!os) return { title: 'OS Not Found — LaptopLifeSpan' }

  return {
    title: `${os.name} Compatible Laptops — LaptopLifeSpan`,
    description: `Find laptops compatible with ${os.name}${os.version ? ` ${os.version}` : ''}. Browse our full list of verified compatible hardware.`,
  }
}

export default async function OSDetailPage({ params }) {
  const { slug } = await params

  const { data: os } = await supabase
    .from('operating_systems')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!os) notFound()

  const { data: compatibilityData } = await supabase
    .from('compatibility')
    .select('*, laptops(*)')
    .eq('os_id', os.id)
    .eq('compatible', true)

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/os" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← Back to all operating systems
        </Link>

<p style={{color: '#2A6EA8'}} className="font-medium mb-1">{os.type}</p>
        <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-2">{os.name}</h1>
        {os.version && <p style={{color: '#2A3A4A'}} className="mb-2">Version: {os.version}</p>}
        {os.description && (
          <p style={{color: '#2A3A4A'}} className="text-lg mb-8">{os.description}</p>
        )}

        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-6">Compatible Laptops</h2>

          {!compatibilityData?.length && (
            <p style={{color: '#2A3A4A'}}>No compatible laptops recorded yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compatibilityData?.map(({ laptops: laptop }) => (
              <Link
                key={laptop.id}
                href={`/laptops/${laptop.slug}`}
                className="rounded-lg p-4 transition hover:opacity-90"
                style={{backgroundColor: '#B8C4CE', border: '1px solid #C4CED8'}}
              >
                <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
                <h3 style={{color: '#102030'}} className="font-semibold">{laptop.model}</h3>
                {laptop.year && <p style={{color: '#243444'}} className="text-sm">{laptop.year}</p>}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}