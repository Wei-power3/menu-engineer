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
            <option value="US">🇺🇸 United States (USD $)</option>
            <option value="UK">🇬🇧 United Kingdom (GBP £)</option>
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
            ? 'Fish & Chips, £16, 32% food cost\nChicken Tikka Masala, £14, 28% food cost'
            : 'Margherita Pizza, $14, 28% food cost\nTruffle Pasta, $22, 35% food cost'}
          rows={10}
          disabled={loading}
          aria-describedby="menuText-hint"
        />
      </div>

      <button type="submit" className="button submit-button" disabled={loading || !menuText.trim()}>
        {loading ? 'Analyzing…' : 'Analyze Menu'}
      </button>
    </form>
  )
}
