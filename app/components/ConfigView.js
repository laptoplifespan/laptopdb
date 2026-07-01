'use client'

import { useState } from 'react'

const rowStyle = { borderBottom: '1px solid #C4CED8' }
const labelCell = { color: '#2A3A4A' }
const valueCell = { color: '#102030' }

// Turns plain text into nodes with any http(s) URLs rendered as clickable links.
function linkify(text) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer"
         style={{color: '#2A6EA8', textDecoration: 'underline'}}>
        {part}
      </a>
    ) : (
      part
    )
  )
}

// Renders the config-aware part of a laptop page: the specs table, the description /
// upgrade path, and the OS compatibility sidebar. A single configuration dropdown drives
// both the spec table and the compatibility dots, so they always stay in sync.
//
// Props:
//   laptop          — model-level fields (year, display, weight, description, upgrade_path)
//   configs         — array of configurations for this laptop
//   allOS           — all operating systems (for the compatibility list)
//   compatByConfig  — { [configurationId]: { [osId]: boolean } }
export default function ConfigView({ laptop, configs, allOS, compatByConfig }) {
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
  const compat = compatByConfig?.[String(selectedId)] ?? {}

  return (
    <div className="flex flex-col lg:flex-row gap-8">

      {/* Left column: specs, description, upgrade path */}
      <div className="flex-1">
        <p style={{color: '#2A6EA8'}} className="font-medium mb-1">{laptop.brand}</p>
        <h1 style={{color: '#102030'}} className="text-4xl font-bold mb-8">{laptop.model}</h1>

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
              {config.vram && <tr style={rowStyle}><td className="py-3" style={labelCell}>VRAM</td><td className="py-3" style={valueCell}>{config.vram}</td></tr>}
              {laptop.display_inches && <tr style={rowStyle}><td className="py-3" style={labelCell}>Display</td><td className="py-3" style={valueCell}>{laptop.display_inches}&quot; {laptop.display_resolution}</td></tr>}
              {laptop.weight_kg && <tr><td className="py-3" style={labelCell}>Weight</td><td className="py-3" style={valueCell}>{laptop.weight_kg}kg</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Description */}
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 mt-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Description</h2>
          {laptop.description ? (
            <p style={{color: '#243444'}} className="leading-relaxed whitespace-pre-line">{laptop.description}</p>
          ) : (
            <p style={{color: '#2A3A4A'}} className="text-sm italic">No description added yet.</p>
          )}
        </div>

        {/* Upgrade Path */}
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 mt-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">Upgrade Path</h2>
          {laptop.upgrade_path ? (
            <p style={{color: '#243444'}} className="leading-relaxed whitespace-pre-line">{linkify(laptop.upgrade_path)}</p>
          ) : (
            <p style={{color: '#2A3A4A'}} className="text-sm italic">No upgrade recommendations added yet.</p>
          )}
        </div>
      </div>

      {/* Right column: OS compatibility for the selected configuration */}
      <div className="lg:w-72">
        <div style={{backgroundColor: '#A4B0BC', border: '1px solid #C4CED8'}} className="rounded-xl p-6 sticky top-6">
          <h2 style={{color: '#102030'}} className="text-xl font-semibold mb-4">OS Compatibility</h2>
          <div className="space-y-3">
            {allOS?.map((os) => {
              const hasData = String(os.id) in compat
              const isCompatible = compat[String(os.id)]
              return (
                <div key={os.id} className="flex items-center justify-between">
                  <div>
                    <p style={{color: '#102030'}} className="text-sm font-medium">{os.name}</p>
                    {os.version && <p style={{color: '#2A3A4A'}} className="text-xs">{os.version}</p>}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    !hasData ? 'bg-gray-400' :
                    isCompatible ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              )
            })}
          </div>
          <div className="text-xs mt-4 flex gap-3" style={{color: '#2A3A4A'}}>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span> Unknown</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500"></span> Compatible</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-500"></span> Incompatible</span>
          </div>
        </div>
      </div>

    </div>
  )
}
