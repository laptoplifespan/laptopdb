'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('laptops')

  // Laptop form state
  const [laptop, setLaptop] = useState({
    brand: '', model: '', slug: '', year: '', cpu: '',
    ram_gb: '', max_ram_gb: '', storage: '', gpu: '',
    display_inches: '', display_resolution: '', weight_kg: ''
  description: ''
  })

  // OS form state
  const [os, setOs] = useState({
    name: '', version: '', slug: '', type: '', description: ''
  })

  // Compatibility form state
  const [compat, setCompat] = useState({
    laptop_slug: '', os_slug: '', compatible: 'true'
  })

  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleAddLaptop = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/laptops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laptop)
    })
    if (res.ok) {
      setMessage('Laptop added successfully!')
      setLaptop({ brand: '', model: '', slug: '', year: '', cpu: '', ram_gb: '', max_ram_gb: '', storage: '', gpu: '', display_inches: '', display_resolution: '', weight_kg: '' })
    } else {
      const data = await res.json()
      setMessage(`Error: ${data.error}`)
    }
  }

  const handleAddOS = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/os', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(os)
    })
    if (res.ok) {
      setMessage('OS added successfully!')
      setOs({ name: '', version: '', slug: '', type: '' })
    } else {
      const data = await res.json()
      setMessage(`Error: ${data.error}`)
    }
  }

  const handleAddCompat = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/compatibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compat)
    })
    if (res.ok) {
      setMessage('Compatibility entry added!')
      setCompat({ laptop_slug: '', os_slug: '', compatible: 'true' })
    } else {
      const data = await res.json()
      setMessage(`Error: ${data.error}`)
    }
  }

  const inputStyle = {
    backgroundColor: '#B8C4CE',
    border: '1px solid #3A5068',
    color: '#102030',
    borderRadius: '6px',
    padding: '8px 12px',
    width: '100%',
    marginBottom: '10px'
  }

  const labelStyle = { color: '#102030', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '4px' }
  const buttonStyle = { backgroundColor: '#2A6EA8', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }
  const tabStyle = (active) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600',
    backgroundColor: active ? '#2A6EA8' : '#A4B0BC',
    color: active ? '#fff' : '#102030'
  })

  if (!authed) {
    return (
      <main style={{backgroundColor: '#B8C4CE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8', borderRadius: '12px', padding: '40px', width: '320px'}}>
          <h1 style={{color: '#102030', fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            {error && <p style={{color: 'red', fontSize: '13px', marginBottom: '10px'}}>{error}</p>}
            <button type="submit" style={buttonStyle}>Login</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main style={{backgroundColor: '#B8C4CE', minHeight: '100vh', padding: '40px 24px'}}>
      <div className="max-w-3xl mx-auto">
        <h1 style={{color: '#102030', fontSize: '32px', fontWeight: '700', marginBottom: '8px'}}>Admin Panel</h1>
        <p style={{color: '#2A3A4A', marginBottom: '32px'}}>LaptopLifeSpan Database Manager</p>

        {message && (
          <div style={{backgroundColor: '#A4B0BC', border: '1px solid #2A6EA8', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#102030'}}>
            {message}
          </div>
        )}

        <div style={{display: 'flex', gap: '8px', marginBottom: '32px'}}>
          <button style={tabStyle(activeTab === 'laptops')} onClick={() => setActiveTab('laptops')}>Add Laptop</button>
          <button style={tabStyle(activeTab === 'os')} onClick={() => setActiveTab('os')}>Add OS</button>
          <button style={tabStyle(activeTab === 'compat')} onClick={() => setActiveTab('compat')}>Add Compatibility</button>
        </div>

        {activeTab === 'laptops' && (
          <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8', borderRadius: '12px', padding: '24px'}}>
            <h2 style={{color: '#102030', fontSize: '20px', fontWeight: '600', marginBottom: '20px'}}>Add New Laptop</h2>
            <form onSubmit={handleAddLaptop}>
              {[['Brand', 'brand'], ['Model', 'model'], ['Slug (e.g. dell-xps-15)', 'slug'], ['Year', 'year'], ['CPU', 'cpu'], ['RAM (GB)', 'ram_gb'], ['Max RAM (GB)', 'max_ram_gb'], ['Storage', 'storage'], ['GPU', 'gpu'], ['Display Size (inches)', 'display_inches'], ['Display Resolution', 'display_resolution'], ['Weight (kg)', 'weight_kg']].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={laptop[key]} onChange={e => setLaptop({...laptop, [key]: e.target.value})} style={inputStyle} />
                </div>
              ))}
             <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={laptop.description || ''}
                  onChange={e => setLaptop({...laptop, description: e.target.value})}
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
                />
              </div>
              <button type="submit" style={buttonStyle}>Add Laptop</button>
            </form>
          </div>
        )}

        {activeTab === 'os' && (
          <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8', borderRadius: '12px', padding: '24px'}}>
            <h2 style={{color: '#102030', fontSize: '20px', fontWeight: '600', marginBottom: '20px'}}>Add New OS</h2>
            <form onSubmit={handleAddOS}>
              {[['Name', 'name'], ['Version', 'version'], ['Slug (e.g. ubuntu-24)', 'slug'], ['Type (Windows / Linux / macOS / ChromeOS)', 'type']].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={os[key]} onChange={e => setOs({...os, [key]: e.target.value})} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={os.description || ''}
                  onChange={e => setOs({...os, description: e.target.value})}
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
                />
              </div>
              <button type="submit" style={buttonStyle}>Add OS</button>
            </form>
          </div>
        )}

        {activeTab === 'compat' && (
          <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8', borderRadius: '12px', padding: '24px'}}>
            <h2 style={{color: '#102030', fontSize: '20px', fontWeight: '600', marginBottom: '20px'}}>Add Compatibility Entry</h2>
            <form onSubmit={handleAddCompat}>
              <label style={labelStyle}>Laptop Slug</label>
              <input value={compat.laptop_slug} onChange={e => setCompat({...compat, laptop_slug: e.target.value})} style={inputStyle} placeholder="e.g. lenovo-thinkpad-t480" />
              <label style={labelStyle}>OS Slug</label>
              <input value={compat.os_slug} onChange={e => setCompat({...compat, os_slug: e.target.value})} style={inputStyle} placeholder="e.g. windows-11" />
              <label style={labelStyle}>Compatible?</label>
              <select value={compat.compatible} onChange={e => setCompat({...compat, compatible: e.target.value})} style={inputStyle}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <button type="submit" style={buttonStyle}>Add Entry</button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}