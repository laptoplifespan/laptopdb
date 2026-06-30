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

  // Compatibility is recorded per configuration; collect the distinct laptops that
  // have at least one configuration compatible with this OS.
  const { data: compatRows } = await supabase
    .from('compatibility')
    .select('configurations(laptops(*))')
    .eq('os_id', os.id)
    .eq('compatible', true)

  const seen = new Set()
  const compatibleLaptops = []
  for (const row of compatRows ?? []) {
    const laptop = row.configurations?.laptops
    if (laptop && !seen.has(laptop.id)) {
      seen.add(laptop.id)
      compatibleLaptops.push(laptop)
    }
  }

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/os" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← Back to all operating systems
        </Link>

        <p style={{color: '#2A6EA8'}} className="font-medium mb-1">{os.type}</p>
        <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-2">{os.name}</h1>
        {os.version && <p style={{color: '#2A3A4A'}} className="mb-8">Version: {os.version}</p>}

        {/* Requirements */}
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 mb-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Requirements</h2>
          {(os.min_ram_gb != null || os.min_storage_gb != null || os.requires_tpm_2_0 != null ||
            os.requires_secure_boot != null || os.min_cpu_intel || os.min_cpu_amd || os.requirements_notes) ? (
            <table className="w-full text-sm">
              <tbody>
                {os.min_cpu_intel && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3 w-48" style={{color: '#2A3A4A'}}>Minimum CPU (Intel)</td><td className="py-3" style={{color: '#102030'}}>{os.min_cpu_intel}</td></tr>}
                {os.min_cpu_amd && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Minimum CPU (AMD)</td><td className="py-3" style={{color: '#102030'}}>{os.min_cpu_amd}</td></tr>}
                {os.min_ram_gb != null && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Minimum RAM</td><td className="py-3" style={{color: '#102030'}}>{os.min_ram_gb}GB</td></tr>}
                {os.min_storage_gb != null && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Minimum Storage</td><td className="py-3" style={{color: '#102030'}}>{os.min_storage_gb}GB</td></tr>}
                {os.requires_tpm_2_0 != null && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>TPM 2.0</td><td className="py-3" style={{color: '#102030'}}>{os.requires_tpm_2_0 ? 'Required' : 'Not required'}</td></tr>}
                {os.requires_secure_boot != null && <tr style={{borderBottom: '1px solid #C4CED8'}}><td className="py-3" style={{color: '#2A3A4A'}}>Secure Boot</td><td className="py-3" style={{color: '#102030'}}>{os.requires_secure_boot ? 'Required' : 'Not required'}</td></tr>}
                {os.requirements_notes && <tr><td className="py-3" style={{color: '#2A3A4A'}}>Notes</td><td className="py-3 whitespace-pre-line" style={{color: '#102030'}}>{os.requirements_notes}</td></tr>}
              </tbody>
            </table>
          ) : (
            <p style={{color: '#2A3A4A'}} className="text-sm italic">No requirements added yet.</p>
          )}
        </div>

        {/* Description */}
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 mb-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Description</h2>
          {os.description ? (
            <p style={{color: '#243444'}} className="leading-relaxed whitespace-pre-line">{os.description}</p>
          ) : (
            <p style={{color: '#2A3A4A'}} className="text-sm italic">No description added yet.</p>
          )}
        </div>

        {/* Compatible Laptops */}
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-6">Compatible Laptops</h2>

          {compatibleLaptops.length === 0 && (
            <p style={{color: '#2A3A4A'}}>No compatible laptops recorded yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compatibleLaptops.map((laptop) => (
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