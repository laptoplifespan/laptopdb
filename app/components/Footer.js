import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{backgroundColor: '#1E2E3E', color: '#A8C0D4'}} className="mt-16 px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">© 2026 LaptopLifeSpan. All rights reserved.</p>
        <Link href="/privacy" style={{color: '#A8C0D4'}} className="text-sm hover:text-white transition">Privacy Policy</Link>
      </div>
    </footer>
  )
}