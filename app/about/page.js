import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

export const metadata = {
  title: 'About — LaptopLifeSpan',
  description: 'Learn about LaptopLifeSpan — our mission to help you find laptop specs, check OS compatibility, and extend your laptop\'s lifespan.',
}

export default function AboutPage() {
  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-8">About LaptopLifeSpan</h1>

        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-8 space-y-6">

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">What We Do</h2>
            <p style={{color: '#243444'}} className="leading-relaxed">
              LaptopLifeSpan is a reference site for laptop specifications, operating system compatibility, and upgrade options. We help you look up a laptop model, compare its configurations, see which operating systems it can run, and understand how you might extend its useful life with RAM, storage, or OS changes.
            </p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Our Mission</h2>
            <p style={{color: '#243444'}} className="leading-relaxed">
              A capable laptop is often written off long before it needs to be. Our goal is to give people clear, practical information — real specifications, honest OS compatibility, and sensible upgrade paths — so they can get more years out of the hardware they already own, or buy used with confidence. Keeping laptops in service longer is good for your wallet and good for the planet.
            </p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">How Our Data Is Compiled</h2>
            <p style={{color: '#243444'}} className="leading-relaxed">
              Each laptop entry is researched and compiled from manufacturer specification sheets and reputable hardware sources. Where a detail cannot be confirmed with confidence, we leave it out rather than guess. Compatibility information reflects whether an operating system can reasonably be installed and run on a given configuration, based on its published requirements. We are always working to expand and refine the database.
            </p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Editorial Independence</h2>
            <p style={{color: '#243444'}} className="leading-relaxed">
              The specifications and compatibility information we publish are not influenced by advertisers or affiliate partners. To keep the site free, we may display advertisements and use affiliate links (for example, to compatible RAM or storage upgrades). If you buy through an affiliate link, we may earn a small commission at no extra cost to you. See our <a href="/privacy" style={{color: '#2A6EA8', textDecoration: 'underline'}}>Privacy Policy</a> for details.
            </p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Get In Touch</h2>
            <p style={{color: '#243444'}} className="leading-relaxed">
              Spotted an error, or want a model added? We would love to hear from you — visit our <a href="/contact" style={{color: '#2A6EA8', textDecoration: 'underline'}}>Contact</a> page.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}
