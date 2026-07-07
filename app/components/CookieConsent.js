'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'll-cookie-consent'

// Lightweight cookie/consent banner. Records the visitor's choice in localStorage
// so it only shows once. Ad/analytics scripts can later read this value to decide
// whether to load personalized content.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Runs only on the client, after mount, so localStorage is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const choose = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E2E3E',
        borderTop: '1px solid #3A5068',
        zIndex: 60,
        padding: '14px 20px',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p style={{ color: '#A8C0D4', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
          We use cookies for analytics and, in the future, advertising to keep LaptopLifeSpan free.
          See our{' '}
          <Link href="/privacy" style={{ color: '#4A9ED8', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
          .
        </p>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => choose('declined')}
            style={{
              backgroundColor: 'transparent',
              color: '#A8C0D4',
              border: '1px solid #3A5068',
              borderRadius: '8px',
              padding: '8px 18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            style={{
              backgroundColor: '#2A6EA8',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
