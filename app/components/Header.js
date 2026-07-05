import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header style={{backgroundColor: '#1E2E3E'}} className="px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/">
          <Image src="/laptoplifespan-logo.svg" alt="LaptopLifeSpan" width={340} height={60} priority />
        </Link>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <form action="/search" className="flex">
            <input
              type="text"
              name="q"
              placeholder="Search laptops & OSes"
              aria-label="Search laptops and operating systems"
              style={{
                backgroundColor: '#B8C4CE',
                border: '1px solid #3A5068',
                color: '#102030',
                borderRadius: '6px',
                padding: '6px 12px',
                width: '220px',
              }}
            />
          </form>
          <nav className="flex gap-6" style={{color: '#A8C0D4'}}>
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/os" className="hover:text-white transition">Operating Systems</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
