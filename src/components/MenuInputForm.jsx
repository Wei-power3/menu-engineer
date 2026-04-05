import React, { useState } from 'react'

let nextId = 1
const makeRow = () => ({ id: nextId++, name: '', price: '', foodCostPct: '' })

const INITIAL_ROWS = [makeRow(), makeRow(), makeRow()]

export default function MenuInputForm({ market, onMarketChange, onSubmit }) {
  const [rows, setRows] = useState(INITIAL_ROWS)

  const updateRow = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const addRow = () => setRows((prev) => [...prev, makeRow()])

  const removeRow = (id) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))

  const validRows = rows.filter(
    (r) => r.name.trim() && r.price !== '' && r.foodCostPct !== ''
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validRows.length < 2) return
    const items = validRows.map((r) => ({
      name: r.name.trim(),
      price: parseFloat(r.price),
      foodCostPct: parseFloat(r.foodCostPct),
    }))
    onSubmit(items, market)
  }

  const sym = market === 'UK' ? '£' : '$'

  return (
    <div className="input-page">
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

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-table">
          <div className="form-header">
            <span>Item name</span>
            <span>Price ({sym})</span>
            <span>Food cost %</span>
            <span />
          </div>

          {rows.map((row) => (
            <div key={row.id} className="form-row">
              <input
                type="text"
                placeholder="e.g. House Burger"
                value={row.name}
                onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                aria-label="Item name"
              />
              <input
                type="number"
                placeholder="16.00"
                min="0.01"
                step="0.01"
                value={row.price}
                onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                aria-label="Price"
              />
              <input
                type="number"
                placeholder="40"
                min="1"
                max="99"
                step="0.1"
                value={row.foodCostPct}
                onChange={(e) => updateRow(row.id, 'foodCostPct', e.target.value)}
                aria-label="Food cost percentage"
              />
              <button
                type="button"
                className="remove-row-btn"
                onClick={() => removeRow(row.id)}
                aria-label="Remove row"
              >
                ×
              </button>
            </div>
          ))}
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
    </div>
  )
}
