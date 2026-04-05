import React, { useMemo, useState } from 'react'
import MenuInputForm from './components/MenuInputForm'
import AnalysisMatrix from './components/AnalysisMatrix'
import PriceAdjustmentMap from './components/PriceAdjustmentMap'
import ActionsList from './components/ActionsList'
import ErrorMessage from './components/ErrorMessage'
import PdfDownloadButton from './components/PdfDownloadButton'
import useMenuAnalysis from './hooks/useMenuAnalysis'

const CATEGORY_ORDER = ['Star', 'Puzzle', 'Plowhorse', 'Dog']

export default function App() {
  const [menuText, setMenuText] = useState('')
  const [market, setMarket] = useState('US')
  const { data, error, loading, analyzeMenu, clearData } = useMenuAnalysis()

  const groupedItems = useMemo(() => {
    const groups = { Star: [], Puzzle: [], Plowhorse: [], Dog: [] }
    if (!data?.items) return groups
    data.items.forEach((item) => {
      if (groups[item.category]) groups[item.category].push(item)
    })
    return groups
  }, [data])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await analyzeMenu({ menuText, market })
  }

  const handleRetry = () => {
    clearData()
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>Menu Engineer</h1>
        <p>
          Paste your menu. Find out what&apos;s bleeding margin, what&apos;s underpriced,
          and what to cut.
        </p>
      </header>

      {!data && (
        <MenuInputForm
          menuText={menuText}
          market={market}
          onMenuTextChange={setMenuText}
          onMarketChange={setMarket}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Analyzing your menu&hellip;</p>
        </div>
      )}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {data && (
        <section className="results" aria-live="polite">
          <div className="results-header">
            <div>
              <h2>Analysis Results</h2>
              <p className="results-summary">
                {data.summary.totalItems} items analyzed &bull; Average contribution margin:{' '}
                <strong>
                  {data.summary.currency === 'GBP' ? '\u00a3' : '$'}
                  {Number(data.summary.averageContributionMargin).toFixed(2)}
                </strong>
              </p>
            </div>

            <div className="results-actions">
              <PdfDownloadButton data={data} />
              <button
                type="button"
                className="button secondary"
                onClick={clearData}
              >
                Analyze another menu
              </button>
            </div>
          </div>

          <AnalysisMatrix
            groupedItems={groupedItems}
            currency={data.summary.currency}
            categoryOrder={CATEGORY_ORDER}
          />

          <PriceAdjustmentMap
            items={data.items}
            currency={data.summary.currency}
          />

          <ActionsList items={data.items} />
        </section>
      )}
    </div>
  )
}
