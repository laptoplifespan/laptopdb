import Link from 'next/link'
import { searchAll } from '@/lib/search'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Search — LaptopLifeSpan',
  description: 'Search laptops and operating systems in the LaptopLifeSpan database.',
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams
  const raw = (params?.q ?? '').trim()

  const { laptops, systems } = raw ? await searchAll(raw) : { laptops: [], systems: [] }
  const total = laptops.length + systems.length

  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 style={{color: '#102030'}} className="text-4xl font-bold mb-2">Search</h2>

        {!raw && (
          <p style={{color: '#2A3A4A'}} className="mb-8">Type a laptop or operating system name in the search box above.</p>
        )}

        {raw && (
          <p style={{color: '#2A3A4A'}} className="mb-8">
            {`${total} result${total === 1 ? '' : 's'} for "${raw}"`}
          </p>
        )}

        {/* Laptop results */}
        {laptops.length > 0 && (
          <section className="mb-12">
            <h3 style={{color: '#102030', borderBottom: '2px solid #2A6EA8'}} className="text-2xl font-bold mb-5 pb-2">Laptops</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laptops.map((laptop) => (
                <Link
                  key={laptop.id}
                  href={`/laptops/${laptop.slug}`}
                  className="rounded-xl p-6 transition hover:opacity-90"
                  style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
                >
                  <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
                  <h4 style={{color: '#102030'}} className="text-xl font-semibold">{laptop.model}</h4>
                  {laptop.year && <p style={{color: '#243444'}} className="text-sm mt-1">{laptop.year}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* OS results */}
        {systems.length > 0 && (
          <section className="mb-12">
            <h3 style={{color: '#102030', borderBottom: '2px solid #2A6EA8'}} className="text-2xl font-bold mb-5 pb-2">Operating Systems</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((os) => (
                <Link
                  key={os.id}
                  href={`/os/${os.slug}`}
                  className="rounded-xl p-6 transition hover:opacity-90"
                  style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
                >
                  <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{os.type}</p>
                  <h4 style={{color: '#102030'}} className="text-xl font-semibold">{os.name}</h4>
                  {os.version && <p style={{color: '#243444'}} className="text-sm mt-1">Version: {os.version}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {raw && total === 0 && (
          <p style={{color: '#2A3A4A'}}>{`No results found for "${raw}". Try a brand, model, or OS name.`}</p>
        )}
      </div>
      <Footer />
    </main>
  )
}
