'use client'

import { useState } from 'react'
import ConfigManager from '@/app/components/ConfigManager'

const EMPTY_LAPTOP = {
  id: null, brand: '', model: '', slug: '', year: '',
  display_inches: '', display_resolution: '', weight_kg: '',
  description: '', upgrade_path: ''
}

const EMPTY_OS = {
  id: null, name: '', version: '', slug: '', type: '', description: '',
  min_ram_gb: '', min_storage_gb: '', requires_tpm_2_0: '', requires_secure_boot: '',
  min_cpu_intel: '', min_cpu_amd: '', requirements_notes: ''
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('laptops')

  const [laptop, setLaptop] = useState(EMPTY_LAPTOP)
  const [os, setOs] = useState(EMPTY_OS)

  // Existing records, loaded so they can be edited.
  const [laptopList, setLaptopList] = useState([])
  const [osList, setOsList] = useState([])

  const [message, setMessage] = useState('')

  const loadLists = async () => {
    const [lRes, oRes] = await Promise.all([
      fetch('/api/admin/laptops'),
      fetch('/api/admin/os'),
    ])
    if (lRes.ok) setLaptopList((await lRes.json()).laptops ?? [])
    if (oRes.ok) setOsList((await oRes.json()).operating_systems ?? [])
  }

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
      loadLists()
    } else {
      setError('Incorrect password')
    }
  }

  // Convert null DB values to '' so inputs stay controlled.
  const toForm = (record, empty) => {
    const out = { ...empty }
    for (const key of Object.keys(empty)) {
      out[key] = record[key] == null ? '' : String(record[key])
    }
    out.id = record.id
    return out
  }

  const handleSaveLaptop = async (e) => {
    e.preventDefault()
    const editing = laptop.id != null
    const res = await fetch('/api/admin/laptops', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(laptop)
    })
    if (res.ok) {
      setMessage(editing ? 'Laptop updated!' : 'Laptop added successfully!')
      setLaptop(EMPTY_LAPTOP)
      loadLists()
    } else {
      const data = await res.json()
      setMessage(`Error: ${data.error}`)
    }
  }

  const handleDeleteLaptop = async () => {
    if (laptop.id == null) return
    if (!confirm(`Delete ${laptop.brand} ${laptop.model}? This also removes its compatibility entries. This cannot be undone.`)) return
    const res = await fetch('/api/admin/laptops', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: laptop.id })
    })
    if (res.ok) {
      setMessage('Laptop deleted.')
      setLaptop(EMPTY_LAPTOP)
      loadLists()
    } else {
      const data = await res.json()
      setMessage(`Error: ${data.error}`)
    }
  }

  const handleSaveOS = async (e) => {
    e.preventDefault()
    const editing = os.id != null
    const res = await fetch('/api/admin/os', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(os)
    })
    if (res.ok) {
      setMessage(editing ? 'OS updated!' : 'OS added successfully!')
      setOs(EMPTY_OS)
      loadLists()
    } else {
      const data = await res.json()
      setMessage(`Error: ${data.error}`)
    }
  }

  const handleDeleteOS = async () => {
    if (os.id == null) return
    if (!confirm(`Delete ${os.name}? This also removes its compatibility entries. This cannot be undone.`)) return
    const res = await fetch('/api/admin/os', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: os.id })
    })
    if (res.ok) {
      setMessage('OS deleted.')
      setOs(EMPTY_OS)
      loadLists()
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
  const deleteButtonStyle = { backgroundColor: '#B83A3A', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', marginLeft: '10px' }
  const secondaryButtonStyle = { backgroundColor: '#A4B0BC', color: '#102030', padding: '10px 24px', borderRadius: '8px', border: '1px solid #3A5068', cursor: 'pointer', fontWeight: '600', marginLeft: '10px' }
  const tabStyle = (active) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600',
    backgroundColor: active ? '#2A6EA8' : '#A4B0BC',
    color: active ? '#fff' : '#102030'
  })
  const selectorStyle = { ...inputStyle, marginBottom: '20px' }

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
          <button style={tabStyle(activeTab === 'laptops')} onClick={() => setActiveTab('laptops')}>Laptops</button>
          <button style={tabStyle(activeTab === 'os')} onClick={() => setActiveTab('os')}>Operating Systems</button>
        </div>

        {activeTab === 'laptops' && (
          <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8', borderRadius: '12px', padding: '24px'}}>
            <h2 style={{color: '#102030', fontSize: '20px', fontWeight: '600', marginBottom: '20px'}}>
              {laptop.id != null ? 'Edit Laptop' : 'Add New Laptop'}
            </h2>

            <label style={labelStyle}>Choose a laptop to edit, or add a new one</label>
            <select
              style={selectorStyle}
              value={laptop.id ?? ''}
              onChange={e => {
                const found = laptopList.find(l => String(l.id) === e.target.value)
                setLaptop(found ? toForm(found, EMPTY_LAPTOP) : EMPTY_LAPTOP)
                setMessage('')
              }}
            >
              <option value="">+ Add new laptop</option>
              {laptopList.map(l => (
                <option key={l.id} value={l.id}>{l.brand} {l.model}</option>
              ))}
            </select>

            <form onSubmit={handleSaveLaptop}>
              {[['Brand', 'brand'], ['Model', 'model'], ['Slug (e.g. dell-xps-15)', 'slug'], ['Year', 'year'], ['Display Size (inches)', 'display_inches'], ['Display Resolution', 'display_resolution'], ['Weight (kg)', 'weight_kg']].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={laptop[key]} onChange={e => setLaptop({...laptop, [key]: e.target.value})} style={inputStyle} />
                </div>
              ))}
              <p style={{color: '#2A3A4A', fontSize: '13px', marginBottom: '10px'}}>
                CPU, RAM, storage, GPU, Soldered RAM and TPM 2.0 are now set per <strong>configuration</strong> — manage them below after saving the laptop.
              </p>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={laptop.description || ''}
                  onChange={e => setLaptop({...laptop, description: e.target.value})}
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
                />
              </div>
              <div>
                <label style={labelStyle}>Upgrade Path (you can paste links — they become clickable)</label>
                <textarea
                  value={laptop.upgrade_path || ''}
                  onChange={e => setLaptop({...laptop, upgrade_path: e.target.value})}
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
                />
              </div>
              <button type="submit" style={buttonStyle}>{laptop.id != null ? 'Save Changes' : 'Add Laptop'}</button>
              {laptop.id != null && (
                <>
                  <button type="button" style={secondaryButtonStyle} onClick={() => { setLaptop(EMPTY_LAPTOP); setMessage('') }}>Cancel</button>
                  <button type="button" style={deleteButtonStyle} onClick={handleDeleteLaptop}>Delete</button>
                </>
              )}
            </form>

            {laptop.id != null && (
              <ConfigManager laptopId={laptop.id} password={password} osList={osList} />
            )}
          </div>
        )}

        {activeTab === 'os' && (
          <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8', borderRadius: '12px', padding: '24px'}}>
            <h2 style={{color: '#102030', fontSize: '20px', fontWeight: '600', marginBottom: '20px'}}>
              {os.id != null ? 'Edit OS' : 'Add New OS'}
            </h2>

            <label style={labelStyle}>Choose an OS to edit, or add a new one</label>
            <select
              style={selectorStyle}
              value={os.id ?? ''}
              onChange={e => {
                const found = osList.find(o => String(o.id) === e.target.value)
                setOs(found ? toForm(found, EMPTY_OS) : EMPTY_OS)
                setMessage('')
              }}
            >
              <option value="">+ Add new OS</option>
              {osList.map(o => (
                <option key={o.id} value={o.id}>{o.name}{o.version ? ` ${o.version}` : ''}</option>
              ))}
            </select>

            <form onSubmit={handleSaveOS}>
              {[['Name', 'name'], ['Version', 'version'], ['Slug (e.g. ubuntu-24)', 'slug'], ['Type (Windows / Linux / macOS / ChromeOS)', 'type']].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={os[key]} onChange={e => setOs({...os, [key]: e.target.value})} style={inputStyle} />
                </div>
              ))}

              <h3 style={{color: '#102030', fontSize: '15px', fontWeight: '700', margin: '16px 0 8px'}}>Requirements</h3>
              {[['Minimum RAM (GB)', 'min_ram_gb'], ['Minimum Storage (GB)', 'min_storage_gb'], ['Minimum CPU — Intel', 'min_cpu_intel'], ['Minimum CPU — AMD', 'min_cpu_amd']].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={os[key]} onChange={e => setOs({...os, [key]: e.target.value})} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Requires TPM 2.0?</label>
                <select value={os.requires_tpm_2_0} onChange={e => setOs({...os, requires_tpm_2_0: e.target.value})} style={inputStyle}>
                  <option value="">Unknown / Not applicable</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Requires Secure Boot?</label>
                <select value={os.requires_secure_boot} onChange={e => setOs({...os, requires_secure_boot: e.target.value})} style={inputStyle}>
                  <option value="">Unknown / Not applicable</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Additional requirements / notes</label>
                <textarea
                  value={os.requirements_notes || ''}
                  onChange={e => setOs({...os, requirements_notes: e.target.value})}
                  style={{...inputStyle, height: '80px', resize: 'vertical'}}
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={os.description || ''}
                  onChange={e => setOs({...os, description: e.target.value})}
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
                />
              </div>
              <button type="submit" style={buttonStyle}>{os.id != null ? 'Save Changes' : 'Add OS'}</button>
              {os.id != null && (
                <>
                  <button type="button" style={secondaryButtonStyle} onClick={() => { setOs(EMPTY_OS); setMessage('') }}>Cancel</button>
                  <button type="button" style={deleteButtonStyle} onClick={handleDeleteOS}>Delete</button>
                </>
              )}
            </form>
          </div>
        )}

      </div>
    </main>
  )
}
