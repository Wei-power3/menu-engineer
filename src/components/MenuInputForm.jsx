import React from 'react'

export default function MenuInputForm({ menuText, market, onMenuTextChange, onMarketChange, onSubmit, loading }) {
  return (
    <form className="menu-form" onSubmit={onSubmit}>
      <label htmlFor="market" className="label">
        Market
      </label>
      <select
        id="market"
        className="select"
        value={market}
        onChange={(event) => onMarketChange(event.target.value)}
        disabled={loading}
      >
        <option value="US">United States (USD)</option>
        <option value="UK">United Kingdom (GBP)</option>
      </select>

      <label htmlFor="menuText" className="label">
        Paste menu items (one per line)
      </label>
      <textarea
        id="menuText"
        className="textarea"
        value={menuText}
        onChange={(event) => onMenuTextChange(event.target.value)}
        placeholder="Margherita Pizza, $14, 28% food cost"
        rows={10}
        disabled={loading}
      />

      <button type="submit" className="button" disabled={loading || !menuText.trim()}>
        {loading ? 'Analyzing...' : 'Analyze Menu'}
      </button>
    </form>
  )
}
