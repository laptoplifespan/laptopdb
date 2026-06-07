import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      {/* Header */}
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

      {/* Hero */}
      <section style={{backgroundColor: '#B8C4CE'}} className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 style={{color: '#102030'}} className="text-5xl font-bold mb-6">Find Your Laptop's Full Potential</h2>
        <p style={{color: '#2A3A4A'}} className="text-xl mb-10 max-w-2xl mx-auto">
          Browse specs for hundreds of laptop models, check OS compatibility, and discover upgrade options to extend your laptop's lifespan.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/laptops" style={{backgroundColor: '#2A6EA8', color: '#FFFFFF'}} className="px-8 py-3 rounded-lg font-semibold transition hover:opacity-90">
            Browse Laptops
          </Link>
          <Link href="/os" style={{color: '#102030', border: '1px solid #3A5068'}} className="px-8 py-3 rounded-lg font-semibold transition hover:opacity-70">
            Operating Systems
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
          <div className="text-3xl mb-4">💻</div>
          <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">Detailed Specs</h3>
          <p style={{color: '#243444'}}>Full hardware specifications for hundreds of laptop models.</p>
        </div>
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
          <div className="text-3xl mb-4">🟢</div>
          <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">OS Compatibility</h3>
          <p style={{color: '#243444'}}>See at a glance which operating systems your laptop can run.</p>
        </div>
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
          <div className="text-3xl mb-4">⚡</div>
          <h3 style={{color: '#102030'}} className="text-xl font-semibold mb-2">Upgrade Guides</h3>
          <p style={{color: '#243444'}}>Find compatible RAM and storage upgrades to breathe new life into your machine.</p>
        </div>
      </section>
    </main>
  )
}