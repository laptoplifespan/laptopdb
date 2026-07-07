'use client'

import { useState } from 'react'
import Link from 'next/link'

const chipStyle = (active) => ({
  backgroundColor: active ? '#2A6EA8' : '#A4B0BC',
  color: active ? '#fff' : '#102030',
  border: active ? '1px solid #2A6EA8' : '1px solid #C4CED8',
  borderRadius: '9999px',
  padding: '6px 16px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
})

const inputStyle = {
  backgroundColor: '#B8C4CE',
  border: '1px solid #3A5068',
  color: '#102030',
  borderRadius: '6px',
  padding: '8px 12px',
  width: '100%',
  maxWidth: '320px',
}

const yearLabel = (y) => (y === 'Unknown' ? 'Year unknown' : y)

const sortYears = (years) =>
  [...years].sort((a, b) => {
    if (a === 'Unknown') return 1
    if (b === 'Unknown') return -1
    return b - a
  })

// Client-side filtering for a single brand's laptops, by year and by model name.
export default function BrandLaptops({ laptops }) {
  const [year, setYear] = useState('all')
  const [query, setQuery] = useState('')

  const availableYears = sortYears(new Set(laptops.map((l) => l.year ?? 'Unknown')))

  const q = query.trim().toLowerCase()
  const filtered = laptops.filter((l) => {
    const yearMatch = year === 'all' || String(l.year ?? 'Unknown') === String(year)
    const modelMatch = !q || (l.model ?? '').toLowerCase().includes(q)
    return yearMatch && modelMatch
  })

  const byYear = new Map()
  for (const l of filtered) {
    const y = l.year ?? 'Unknown'
    if (!byYear.has(y)) byYear.set(y, [])
    byYear.get(y).push(l)
  }
  const orderedYears = sortYears(byYear.keys())

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <button type="button" style={chipStyle(year === 'all')} onClick={() => setYear('all')}>All years</button>
          {availableYears.map((y) => (
            <button key={y} type="button" style={chipStyle(String(year) === String(y))} onClick={() => setYear(y)}>
              {yearLabel(y)}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by model…"
          aria-label="Filter by model name"
          style={inputStyle}
        />
      </div>

      {/* Results */}
      {filtered.length === 0 && (
        <p style={{color: '#2A3A4A'}} className="text-sm italic">No models match your filters.</p>
      )}

      {orderedYears.map((y) => (
        <div key={y} className="mb-8">
          <h3 style={{color: '#102030', borderBottom: '2px solid #2A6EA8'}} className="text-2xl font-bold mb-5 pb-2">
            {yearLabel(y)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {byYear.get(y).map((laptop) => (
              <Link
                key={laptop.id}
                href={`/laptops/${laptop.slug}`}
                className="rounded-xl p-6 transition hover:opacity-90"
                style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}}
              >
                <p style={{color: '#2A6EA8'}} className="text-sm font-medium mb-1">{laptop.brand}</p>
                <h4 style={{color: '#102030'}} className="text-xl font-semibold">{laptop.model}</h4>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
