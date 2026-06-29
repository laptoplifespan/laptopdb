'use client'

import { useState, useEffect, useCallback } from 'react'

const EMPTY_CONFIG = {
  id: null, label: '', cpu: '', ram_gb: '', soldered_ram: '',
  max_ram_gb: '', tpm_2_0: '', storage: '', gpu: '', sort_order: ''
}

const inputStyle = {
  backgroundColor: '#B8C4CE', border: '1px solid #3A5068', color: '#102030',
  borderRadius: '6px', padding: '8px 12px', width: '100%', marginBottom: '10px'
}
const labelStyle = { color: '#102030', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '4px' }
const buttonStyle = { backgroundColor: '#2A6EA8', color: '#fff', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }
const secondaryButtonStyle = { backgroundColor: '#A4B0BC', color: '#102030', padding: '8px 18px', borderRadius: '8px', border: '1px solid #3A5068', cursor: 'pointer', fontWeight: '600', marginLeft: '8px' }
const deleteButtonStyle = { backgroundColor: '#B83A3A', color: '#fff', padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }
const editButtonStyle = { backgroundColor: '#A4B0BC', color: '#102030', padding: '6px 14px', borderRadius: '8px', border: '1px solid #3A5068', cursor: 'pointer', fontWeight: '600', marginRight: '8px' }

// Manages the configurations belonging to a single laptop (add / edit / delete).
export default function ConfigManager({ laptopId, password }) {
  const [configs, setConfigs] = useState([])
  const [form, setForm] = useState(EMPTY_CONFIG)
  const [note, setNote] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/configurations?laptop_id=${laptopId}`)
    if (res.ok) setConfigs((await res.json()).configurations ?? [])
  }, [laptopId])

  // load() only setStates asynchronously after the fetch resolves, so this is the
  // standard load-on-mount pattern, not a synchronous cascading render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  const toForm = (record) => {
    const out = { ...EMPTY_CONFIG }
    for (const key of Object.keys(EMPTY_CONFIG)) {
      out[key] = record[key] == null ? '' : String(record[key])
    }
    out.id = record.id
    return out
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const editing = form.id != null
    const res = await fetch('/api/admin/configurations', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ ...form, laptop_id: laptopId })
    })
    if (res.ok) {
      setNote(editing ? 'Configuration updated.' : 'Configuration added.')
      setForm(EMPTY_CONFIG)
      load()
    } else {
      const data = await res.json()
      setNote(`Error: ${data.error}`)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this configuration? This cannot be undone.')) return
    const res = await fetch('/api/admin/configurations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setNote('Configuration deleted.')
      if (form.id === id) setForm(EMPTY_CONFIG)
      load()
    } else {
      const data = await res.json()
      setNote(`Error: ${data.error}`)
    }
  }

  return (
    <div style={{backgroundColor: '#B8C4CE', border: '1px solid #C4CED8', borderRadius: '12px', padding: '20px', marginTop: '24px'}}>
      <h3 style={{color: '#102030', fontSize: '18px', fontWeight: '700', marginBottom: '4px'}}>Configurations</h3>
      <p style={{color: '#2A3A4A', fontSize: '13px', marginBottom: '16px'}}>
        The spec options shoppers can switch between (CPU, RAM, storage, etc.). Each laptop needs at least one.
      </p>

      {note && <p style={{color: '#102030', fontSize: '13px', marginBottom: '12px', fontWeight: 600}}>{note}</p>}

      {/* Existing configurations */}
      {configs.length === 0 && (
        <p style={{color: '#2A3A4A', fontSize: '13px', fontStyle: 'italic', marginBottom: '12px'}}>No configurations yet — add one below.</p>
      )}
      {configs.map(c => (
        <div key={c.id} style={{backgroundColor: '#A4B0BC', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{color: '#102030', fontSize: '14px'}}>
            <strong>{c.label || 'Untitled configuration'}</strong>
            <span style={{color: '#2A3A4A'}}>{c.cpu ? ` — ${c.cpu}` : ''}{c.ram_gb ? `, ${c.ram_gb}GB` : ''}</span>
          </div>
          <div>
            <button type="button" style={editButtonStyle} onClick={() => { setForm(toForm(c)); setNote('') }}>Edit</button>
            <button type="button" style={deleteButtonStyle} onClick={() => handleDelete(c.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Add / edit form */}
      <form onSubmit={handleSave} style={{marginTop: '16px', borderTop: '1px solid #C4CED8', paddingTop: '16px'}}>
        <h4 style={{color: '#102030', fontSize: '15px', fontWeight: '700', marginBottom: '12px'}}>
          {form.id != null ? 'Edit configuration' : 'Add a configuration'}
        </h4>

        <label style={labelStyle}>Label (e.g. &quot;Core i5 / 16GB / 512GB&quot;)</label>
        <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} style={inputStyle} />

        {[['CPU', 'cpu'], ['RAM (GB)', 'ram_gb'], ['Max RAM (GB)', 'max_ram_gb'], ['Storage', 'storage'], ['GPU', 'gpu'], ['Sort order (lower shows first)', 'sort_order']].map(([label, key]) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} style={inputStyle} />
            {key === 'ram_gb' && (
              <>
                <label style={labelStyle}>Soldered RAM (non-replaceable?)</label>
                <select value={form.soldered_ram} onChange={e => setForm({...form, soldered_ram: e.target.value})} style={inputStyle}>
                  <option value="">Unknown</option>
                  <option value="true">Yes — soldered</option>
                  <option value="false">No — replaceable</option>
                </select>
              </>
            )}
            {key === 'max_ram_gb' && (
              <>
                <label style={labelStyle}>TPM 2.0 (required for Windows 11)</label>
                <select value={form.tpm_2_0} onChange={e => setForm({...form, tpm_2_0: e.target.value})} style={inputStyle}>
                  <option value="">Unknown</option>
                  <option value="true">Yes — has TPM 2.0</option>
                  <option value="false">No — no TPM 2.0</option>
                </select>
              </>
            )}
          </div>
        ))}

        <button type="submit" style={buttonStyle}>{form.id != null ? 'Save Configuration' : 'Add Configuration'}</button>
        {form.id != null && (
          <button type="button" style={secondaryButtonStyle} onClick={() => { setForm(EMPTY_CONFIG); setNote('') }}>Cancel</button>
        )}
      </form>
    </div>
  )
}
