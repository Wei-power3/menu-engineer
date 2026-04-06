import React, { useRef, useState } from 'react'

// ─── Benchmark lookup (NRA / Forte SG COGS 2025) ─────────────────────────
const FOOD_COST_BENCHMARKS = {
  QSR:          { label: 'QSR / Fast Food',    pct: 27 },
  FastCasual:   { label: 'Fast Casual',         pct: 30 },
  CasualDining: { label: 'Casual Dining',       pct: 32 },
  FineDining:   { label: 'Fine Dining',         pct: 35 },
  Bar:          { label: 'Bar / Beverage-led',  pct: 22 },
  Pizzeria:     { label: 'Pizzeria',            pct: 24 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────
let nextId = 1
const makeRow = () => ({
  id: nextId++,
  name: '',
  price: '',
  foodCostPct: '',
  useCalc: false,
  ingredientCost: '',
})

function calcPct(ingredientCost, price) {
  const cost = parseFloat(ingredientCost)
  const p = parseFloat(price)
  if (!cost || !p || p <= 0) return null
  return parseFloat(((cost / p) * 100).toFixed(1))
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const INITIAL_ROWS = [makeRow(), makeRow(), makeRow()]

// ─── Component ────────────────────────────────────────────────────────────
export default function MenuInputForm({ market, onMarketChange, onSubmit }) {
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [selectedType, setSelectedType] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanMessage, setScanMessage] = useState(null)
  const fileInputRef = useRef(null)

  // ── Row management ──────────────────────────────────────────────────────
  const updateRow = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const addRow = () => {
    const pct = selectedType ? String(FOOD_COST_BENCHMARKS[selectedType].pct) : ''
    setRows((prev) => [...prev, { ...makeRow(), foodCostPct: pct }])
  }

  const removeRow = (id) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))

  const toggleCalc = (id) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, useCalc: !r.useCalc, ingredientCost: '', foodCostPct: '' }
          : r
      )
    )

  // ── Feature 1: Restaurant type → benchmark pre-fill ─────────────────────
  const handleTypeChange = (e) => {
    const type = e.target.value
    setSelectedType(type)
    if (!type) return
    const pct = String(FOOD_COST_BENCHMARKS[type].pct)
    setRows((prev) =>
      prev.map((r) =>
        // Only fill rows that are empty and not in calc mode
        r.foodCostPct === '' && !r.useCalc ? { ...r, foodCostPct: pct } : r
      )
    )
  }

  // ── Feature 3: Photo scan ───────────────────────────────────────────────
  const handleScanClick = () => {
    setScanMessage(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setScanning(true)
    setScanMessage(null)
    try {
      const base64 = await readFileAsBase64(file)
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType: file.type }),
      })
      const data = await res.json()
      if (!res.ok || data.error || !data.items?.length) {
        setScanMessage({
          type: 'error',
          text: data.error || "Couldn't read the menu — try a clearer photo or add items manually",
        })
        return
      }
      const scannedRows = data.items.map((item) => ({
        ...makeRow(),
        name: item.name,
        price: String(item.price),
      }))
      while (scannedRows.length < 3) scannedRows.push(makeRow())
      setRows(scannedRows)
      setScanMessage({
        type: 'success',
        text: `${data.items.length} items found — add food costs to analyse`,
      })
      document.querySelector('.form-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      setScanMessage({
        type: 'error',
        text: "Couldn't read the menu — try a clearer photo or add items manually",
      })
    } finally {
      setScanning(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Validation + submit ─────────────────────────────────────────────────
  const getEffectivePct = (r) => {
    if (r.useCalc) {
      const pct = calcPct(r.ingredientCost, r.price)
      return pct !== null ? String(pct) : ''
    }
    return r.foodCostPct
  }

  const validRows = rows.filter((r) => {
    if (!r.name.trim() || r.price === '') return false
    return getEffectivePct(r) !== ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validRows.length < 2) return
    const items = validRows.map((r) => ({
      name: r.name.trim(),
      price: parseFloat(r.price),
      foodCostPct: parseFloat(getEffectivePct(r)),
    }))
    onSubmit(items, market)
  }

  const sym = market === 'UK' ? '£' : '$'
  const benchmarkLabel = selectedType ? FOOD_COST_BENCHMARKS[selectedType].label : null

  return (
    <div className="input-page">

      {/* Market toggle */}
      <div className="market-toggle">
        <button
          type="button"
          className={`toggle-btn${market === 'US' ? ' active' : ''}`}
          onClick={() => onMarketChange('US')}
        >
          🇺🇸 US
        </button>
        <button
          type="button"
          className={`toggle-btn${market === 'UK' ? ' active' : ''}`}
          onClick={() => onMarketChange('UK')}
        >
          🇬🇧 UK
        </button>
      </div>

      {market === 'UK' && (
        <div className="uk-notice" role="note">
          <strong>DMCCA 2024 active.</strong> Service charges must be included in displayed prices from April 2025.
        </div>
      )}

      {/* Feature 1: Restaurant type selector */}
      <div className="type-selector">
        <label htmlFor="restaurant-type">Restaurant type</label>
        <select id="restaurant-type" value={selectedType} onChange={handleTypeChange}>
          <option value="">Select your type (optional)</option>
          {Object.entries(FOOD_COST_BENCHMARKS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="input-form">

        {/* Feature 3: Scan toolbar */}
        <div className="form-toolbar">
          <span className="form-toolbar-title">Menu items</span>
          <button
            type="button"
            className="scan-btn"
            onClick={handleScanClick}
            disabled={scanning}
          >
            {scanning ? 'Scanning…' : '📷 Scan menu'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {scanMessage && (
          <div
            className={`scan-message scan-message--${scanMessage.type}`}
            role={scanMessage.type === 'error' ? 'alert' : 'status'}
          >
            {scanMessage.text}
          </div>
        )}

        {/* Form table */}
        <div className="form-table">
          <div className="form-header">
            <span>Item name</span>
            <span>Price ({sym})</span>
            <div className="form-header-cost">
              <span>Food cost %</span>
              {benchmarkLabel && (
                <span className="form-cost-hint">
                  Pre-filled from {benchmarkLabel} avg — edit freely
                </span>
              )}
            </div>
            <span />
            <span />
          </div>

          {rows.map((row) => {
            const pct = row.useCalc ? calcPct(row.ingredientCost, row.price) : null
            const pctWarning = pct !== null && (pct > 99 || pct < 1)
            const emptyAfterScan = row.name && row.price && !row.useCalc && row.foodCostPct === ''

            return (
              <div key={row.id} className="form-row">
                {/* Name */}
                <input
                  type="text"
                  placeholder="e.g. House Burger"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                  aria-label="Item name"
                />
                {/* Price */}
                <input
                  type="number"
                  placeholder="16.00"
                  min="0.01"
                  step="0.01"
                  value={row.price}
                  onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                  aria-label="Price"
                />
                {/* Food cost — Feature 2: calc toggle */}
                <div className="cost-cell">
                  {row.useCalc ? (
                    <>
                      <input
                        type="number"
                        placeholder="e.g. 4.20"
                        min="0.01"
                        step="0.01"
                        value={row.ingredientCost}
                        onChange={(e) => updateRow(row.id, 'ingredientCost', e.target.value)}
                        aria-label="Ingredient cost"
                      />
                      <span className={`calc-display${pctWarning ? ' calc-display--warn' : ''}`}>
                        {pct === null ? '—' : pctWarning ? '⚠ Check values' : `= ${pct}%`}
                      </span>
                    </>
                  ) : (
                    <input
                      type="number"
                      placeholder="40"
                      min="1"
                      max="99"
                      step="0.1"
                      value={row.foodCostPct}
                      onChange={(e) => updateRow(row.id, 'foodCostPct', e.target.value)}
                      aria-label="Food cost percentage"
                      className={emptyAfterScan ? 'input-highlight' : ''}
                    />
                  )}
                </div>
                {/* Remove */}
                <button
                  type="button"
                  className="remove-row-btn"
                  onClick={() => removeRow(row.id)}
                  aria-label="Remove row"
                >
                  ×
                </button>
                {/* Feature 2: Calc toggle button */}
                <button
                  type="button"
                  className={`calc-toggle-btn${row.useCalc ? ' active' : ''}`}
                  onClick={() => toggleCalc(row.id)}
                  title={row.useCalc ? 'Switch to % entry' : 'Calculate % from ingredient cost'}
                >
                  {row.useCalc ? '%' : 'Calc'}
                </button>
              </div>
            )
          })}
        </div>

        <button type="button" className="add-row-btn" onClick={addRow}>
          + Add item
        </button>

        <button
          type="submit"
          className="button submit-button"
          disabled={validRows.length < 2}
        >
          {validRows.length >= 2
            ? `Analyse ${validRows.length} items`
            : 'Add at least 2 items to analyse'}
        </button>
      </form>

      {/* Sticky CTA — keeps Analyse button visible when rows push it below fold */}
      {validRows.length >= 2 && (
        <div className="sticky-analyse-bar">
          <button
            type="button"
            className="button submit-button sticky-analyse-btn"
            onClick={handleSubmit}
          >
            Analyse {validRows.length} items
          </button>
        </div>
      )}
    </div>
  )
}
