import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

export const metadata = {
  title: 'Contact — LaptopLifeSpan',
  description: 'Get in touch with LaptopLifeSpan — report a correction, request a laptop model, or ask a question.',
}

export default function ContactPage() {
  return (
    <main style={{backgroundColor: '#B8C4CE'}} className="min-h-screen">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-8">Contact Us</h1>

        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-8 space-y-6">

          <div>
            <p style={{color: '#243444'}} className="leading-relaxed">
              We would love to hear from you. Whether you have spotted an error in a specification, want a laptop model or operating system added to the database, or just have a question, feel free to reach out.
            </p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">Email</h2>
            <p style={{color: '#243444'}} className="leading-relaxed">
              <a href="mailto:contact@laptoplifespan.com" style={{color: '#2A6EA8', textDecoration: 'underline'}}>
                contact@laptoplifespan.com
              </a>
            </p>
          </div>

          <div>
            <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-3">What to Include</h2>
            <ul style={{color: '#243444'}} className="leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Corrections:</strong> the laptop or OS name, the field that is wrong, and the correct value (a source link helps).</li>
              <li><strong>Requests:</strong> the exact model name or number you would like us to add.</li>
              <li><strong>Questions:</strong> as much detail as you can, so we can help quickly.</li>
            </ul>
          </div>

          <div>
            <p style={{color: '#2A3A4A'}} className="text-sm">
              We read every message and aim to respond as soon as we can. Thanks for helping us keep the database accurate.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}
