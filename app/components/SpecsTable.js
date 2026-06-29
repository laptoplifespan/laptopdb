'use client'

import { useState } from 'react'

const rowStyle = { borderBottom: '1px solid #C4CED8' }
const labelCell = { color: '#2A3A4A' }
const valueCell = { color: '#102030' }

// Renders the Specifications card. Model-level fields (year, display, weight) come
// from `laptop`; per-config fields come from the selected configuration. A dropdown
// appears only when there is more than one configuration to choose from.
export default function SpecsTable({ laptop, configs }) {
  // Fallback: if a laptop somehow has no configurations, build one from its own columns.
  const list = configs && configs.length > 0 ? configs : [{
    id: 'self',
    label: 'Standard configuration',
    cpu: laptop.cpu, ram_gb: laptop.ram_gb, soldered_ram: laptop.soldered_ram,
    max_ram_gb: laptop.max_ram_gb, tpm_2_0: laptop.tpm_2_0,
    storage: laptop.storage, gpu: laptop.gpu,
  }]

  const [selectedId, setSelectedId] = useState(list[0].id)
  const config = list.find(c => c.id === selectedId) ?? list[0]

  return (
    <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6">
      <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Specifications</h2>

      {list.length > 1 && (
        <div className="mb-4">
          <label style={{color: '#2A3A4A'}} className="text-sm font-medium block mb-1">Configuration</label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{backgroundColor: '#B8C4CE', border: '1px solid #3A5068', color: '#102030', borderRadius: '6px', padding: '8px 12px', width: '100%'}}
          >
            {list.map(c => (
              <option key={c.id} value={c.id}>{c.label || 'Configuration'}</option>
            ))}
          </select>
        </div>
      )}

      <table className="w-full text-sm">
        <tbody>
          {laptop.year && <tr style={rowStyle}><td className="py-3 w-40" style={labelCell}>Year</td><td className="py-3" style={valueCell}>{laptop.year}</td></tr>}
          {config.cpu && <tr style={rowStyle}><td className="py-3" style={labelCell}>CPU</td><td className="py-3" style={valueCell}>{config.cpu}</td></tr>}
          {config.ram_gb && <tr style={rowStyle}><td className="py-3" style={labelCell}>RAM</td><td className="py-3" style={valueCell}>{config.ram_gb}GB</td></tr>}
          {config.soldered_ram != null && <tr style={rowStyle}><td className="py-3" style={labelCell}>Soldered RAM</td><td className="py-3" style={valueCell}>{config.soldered_ram ? 'Yes' : 'No'}</td></tr>}
          {config.max_ram_gb && <tr style={rowStyle}><td className="py-3" style={labelCell}>Max RAM</td><td className="py-3" style={valueCell}>{config.max_ram_gb}GB</td></tr>}
          {config.tpm_2_0 != null && <tr style={rowStyle}><td className="py-3" style={labelCell}>TPM 2.0</td><td className="py-3" style={valueCell}>{config.tpm_2_0 ? 'Yes' : 'No'}</td></tr>}
          {config.storage && <tr style={rowStyle}><td className="py-3" style={labelCell}>Storage</td><td className="py-3" style={valueCell}>{config.storage}</td></tr>}
          {config.gpu && <tr style={rowStyle}><td className="py-3" style={labelCell}>GPU</td><td className="py-3" style={valueCell}>{config.gpu}</td></tr>}
          {laptop.display_inches && <tr style={rowStyle}><td className="py-3" style={labelCell}>Display</td><td className="py-3" style={valueCell}>{laptop.display_inches}&quot; {laptop.display_resolution}</td></tr>}
          {laptop.weight_kg && <tr><td className="py-3" style={labelCell}>Weight</td><td className="py-3" style={valueCell}>{laptop.weight_kg}kg</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
