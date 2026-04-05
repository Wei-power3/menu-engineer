import React from 'react'

export default function MenuInputForm({ menuText, market, onMenuTextChange, onMarketChange, onSubmit, loading }) {
  return (
    <form className="menu-form" onSubmit={onSubmit}>
      <div className="form-market">
        <div className="form-field">
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
            <option value="US">\ud83c\uddfa\ud83c\uddf8 United States (USD $)</option>
            <option value="UK">\ud83c\uddec\ud83c\udde7 United Kingdom (GBP \u00a3)</option>
          </select>
        </div>

        {market === 'UK' && (
          <div className="uk-notice" role="note">
            <strong>DMCCA 2024 active.</strong> Service charges must be included in displayed prices from April 2025. Your report will flag any compliance concerns per item.
          </div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="menuText" className="label">
          Paste your menu items
        </label>
        <p className="form-hint">One item per line &mdash; name, price, food cost %</p>
        <textarea
          id="menuText"
          className="textarea"
          value={menuText}
          onChange={(event) => onMenuTextChange(event.target.value)}
          placeholder={market === 'UK'
            ? 'Fish & Chips, \u00a316, 32% food cost\nChicken Tikka Masala, \u00a314, 28% food cost'
            : 'Margherita Pizza, $14, 28% food cost\nTruffle Pasta, $22, 35% food cost'}
          rows={10}
          disabled={loading}
          aria-describedby="menuText-hint"
        />
      </div>

      <button type="submit" className="button submit-button" disabled={loading || !menuText.trim()}>
        {loading ? 'Analyzing\u2026' : 'Analyze Menu'}
      </button>
    </form>
  )
}
