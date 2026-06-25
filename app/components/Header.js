import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
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
  )
}
