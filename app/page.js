import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">LaptopLifeSpan</h1>
          <nav className="flex gap-6 text-gray-300">
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/os" className="hover:text-white transition">Operating Systems</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Find Your Laptop's Full Potential</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Browse specs for hundreds of laptop models, check OS compatibility, and discover upgrade options to extend your laptop's lifespan.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/laptops" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition">
            Browse Laptops
          </Link>
          <Link href="/os" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Operating Systems
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl mb-4">💻</div>
          <h3 className="text-xl font-semibold mb-2">Detailed Specs</h3>
          <p className="text-gray-400">Full hardware specifications for hundreds of laptop models.</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl mb-4">🟢</div>
          <h3 className="text-xl font-semibold mb-2">OS Compatibility</h3>
          <p className="text-gray-400">See at a glance which operating systems your laptop can run.</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Upgrade Guides</h3>
          <p className="text-gray-400">Find compatible RAM and storage upgrades to breathe new life into your machine.</p>
        </div>
      </section>
    </main>
  )
}