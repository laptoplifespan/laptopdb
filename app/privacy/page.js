import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Privacy Policy — LaptopLifeSpan',
  description: 'Privacy policy for LaptopLifeSpan.com',
}

export default function PrivacyPage() {
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-8 space-y-6">

          <div>
            <p style={{color: '#2A3A4A'}} className="text-sm mb-4">Last updated: June 2026</p>
            <p style={{color: '#102030'}}>This privacy policy describes how LaptopLifeSpan ("we", "us", or "our") collects, uses, and shares information when you visit www.laptoplifespan.com.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p style={{color: '#243444'}}>We do not directly collect personal information from visitors. We may use third-party services such as Google Analytics and Google AdSense that collect anonymous usage data including pages visited, time spent on site, browser type, and general geographic location.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Cookies</h2>
            <p style={{color: '#243444'}}>Our site may use cookies through third-party advertising and analytics services. These cookies help us understand site traffic and deliver relevant advertisements. You can control cookie settings through your browser preferences.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Advertising</h2>
            <p style={{color: '#243444'}}>We may display advertisements served by Google AdSense and other networks. These services may use cookies to show ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" style={{color: '#2A6EA8'}}>Google's Ads Settings</a>.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Affiliate Links</h2>
            <p style={{color: '#243444'}}>Some links on this site may be affiliate links. If you click an affiliate link and make a purchase, we may earn a small commission at no additional cost to you. We only link to products we believe are relevant and useful to our readers.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Third Party Links</h2>
            <p style={{color: '#243444'}}>Our site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p style={{color: '#243444'}}>We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.</p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Contact</h2>
            <p style={{color: '#243444'}}>If you have any questions about this privacy policy, you can reach us through the contact information on this site.</p>
          </div>

        </div>
      </div>

      <footer style={{backgroundColor: '#1E2E3E', color: '#A8C0D4'}} className="mt-16 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 LaptopLifeSpan. All rights reserved.</p>
          <Link href="/privacy" style={{color: '#A8C0D4'}} className="text-sm hover:text-white transition">Privacy Policy</Link>
        </div>
      </footer>
    </main>
  )
}