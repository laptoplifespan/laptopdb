import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import ConfigView from '@/app/components/ConfigView'
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: laptop } = await supabase
    .from('laptops')
    .select('brand, model, year')
    .eq('slug', slug)
    .single()

  if (!laptop) return { title: 'Laptop Not Found — LaptopLifeSpan' }

  return {
    title: `${laptop.brand} ${laptop.model} Specs & OS Compatibility — LaptopLifeSpan`,
    description: `Full specs for the ${laptop.brand} ${laptop.model}${laptop.year ? ` (${laptop.year})` : ''}. Check OS compatibility and upgrade options.`,
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

  const { data: configs } = await supabase
    .from('configurations')
    .select('*')
    .eq('laptop_id', laptop.id)
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true })

  const { data: allOS } = await supabase
    .from('operating_systems')
    .select('*')
    .order('name', { ascending: true })

  // Compatibility now lives per configuration. Fetch all rows for this laptop's
  // configs and index them as { [configurationId]: { [osId]: compatible } }.
  const configIds = (configs ?? []).map(c => c.id)
  const compatByConfig = {}
  if (configIds.length > 0) {
    const { data: compatRows } = await supabase
      .from('compatibility')
      .select('configuration_id, os_id, compatible')
      .in('configuration_id', configIds)

    for (const row of compatRows ?? []) {
      const key = String(row.configuration_id)
      ;(compatByConfig[key] ??= {})[String(row.os_id)] = row.compatible
    }
  }

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/laptops" style={{color: '#2A6EA8'}} className="hover:opacity-70 text-sm mb-6 inline-block">
          ← Back to all laptops
        </Link>

        <ConfigView laptop={laptop} configs={configs} allOS={allOS} compatByConfig={compatByConfig} />
      </div>
      <Footer />
    </main>
  )
}
