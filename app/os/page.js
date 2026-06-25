import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
export const metadata = {
  title: 'Operating Systems — LaptopLifeSpan',
  description: 'Browse all operating systems in our database and find compatible laptops for each one.',
}

export const dynamic = 'force-dynamic'

export default async function OSPage() {
  const { data: systems, error } = await supabase
    .from('operating_systems')
    .select('*')
    .order('name', { ascending: true })

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 style={{color: '#102030'}} className="text-4xl font-bold mb-8">Operating Systems</h2>

        {error && <p className="text-red-600">Error loading operating systems.</p>}

        {!error && systems?.length === 0 && (
          <p style={{color: '#2A3A4A'}}>No operating systems in the database yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems?.map((os) => (
            <Link
              key={os.id}
              href={`/os/${os.slug}`}
              className="rounded-xl p-6 block transition hover:opacity-90"
              style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
            >
              <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{os.type}</p>
              <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-1">{os.name}</h3>
              {os.version && <p style={{color: '#243444'}} className="text-sm">Version: {os.version}</p>}
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}