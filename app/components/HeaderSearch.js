'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const EMPTY = { laptops: [], systems: [] }

const itemStyle = {
  display: 'block',
  padding: '8px 12px',
  color: '#102030',
  borderBottom: '1px solid #C4CED8',
}

// `hero` renders a larger, full-width search (for the homepage hero); otherwise
// the compact header size.
export default function HeaderSearch({ hero = false }) {
  const inputStyle = {
    backgroundColor: '#B8C4CE',
    border: '1px solid #3A5068',
    color: '#102030',
    borderRadius: hero ? '10px' : '6px',
    padding: hero ? '14px 18px' : '6px 12px',
    fontSize: hero ? '16px' : '14px',
    width: hero ? '100%' : '220px',
  }
  const [q, setQ] = useState('')
  const [results, setResults] = useState(EMPTY)
  const [open, setOpen] = useState(false)

  // Debounced typeahead lookup. All state updates happen inside the timeout
  // (never synchronously in the effect body), so results settle after typing pauses.
  useEffect(() => {
    const query = q.trim()
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults(EMPTY)
        setOpen(false)
        return
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults({ laptops: data.laptops ?? [], systems: data.operating_systems ?? [] })
          setOpen(true)
        }
      } catch {
        /* ignore network errors in the typeahead */
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [q])

  const hasResults = results.laptops.length + results.systems.length > 0

  return (
    <div style={{ position: 'relative' }}>
      <form action="/search" className="flex" autoComplete="off">
        <input
          type="text"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (hasResults) setOpen(true) }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search Laptops and OSs"
          aria-label="Search laptops and operating systems"
          style={inputStyle}
        />
      </form>

      {open && (q.trim().length >= 2) && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            left: hero ? 0 : 'auto',
            width: hero ? 'auto' : '300px',
            maxHeight: '70vh',
            overflowY: 'auto',
            backgroundColor: '#A4B0BC',
            border: '1px solid #3A5068',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(16,32,48,0.35)',
            zIndex: 50,
          }}
        >
          {!hasResults && (
            <div style={{ padding: '10px 12px', color: '#2A3A4A', fontSize: '14px' }}>No matches</div>
          )}

          {results.laptops.map((l) => (
            <Link key={`l-${l.id}`} href={`/laptops/${l.slug}`} onClick={() => setOpen(false)}
                  className="transition hover:opacity-80" style={itemStyle}>
              <span style={{ color: '#2A6EA8', fontSize: '12px', fontWeight: 600 }}>{l.brand}</span>
              <span style={{ fontSize: '14px' }}> {l.model}{l.year ? ` (${l.year})` : ''}</span>
            </Link>
          ))}

          {results.systems.map((o) => (
            <Link key={`o-${o.id}`} href={`/os/${o.slug}`} onClick={() => setOpen(false)}
                  className="transition hover:opacity-80" style={itemStyle}>
              <span style={{ color: '#2A6EA8', fontSize: '12px', fontWeight: 600 }}>{o.type}</span>
              <span style={{ fontSize: '14px' }}> {o.name}{o.version ? ` ${o.version}` : ''}</span>
            </Link>
          ))}

          {hasResults && (
            <Link href={`/search?q=${encodeURIComponent(q.trim())}`} onClick={() => setOpen(false)}
                  className="transition hover:opacity-80"
                  style={{ display: 'block', padding: '8px 12px', color: '#2A6EA8', fontSize: '13px', fontWeight: 600 }}>
              View all results →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
