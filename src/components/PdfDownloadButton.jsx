import React, { useState } from 'react'

export default function PdfDownloadButton({ data }) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)

    try {
      // Dynamically import jsPDF to keep initial bundle small
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })

      const symbol = data.summary.currency === 'GBP' ? '\u00a3' : '$'
      const margin = 40
      const pageWidth = doc.internal.pageSize.getWidth()
      const maxWidth = pageWidth - margin * 2
      let y = margin

      const LINE = 18
      const SECTION_GAP = 28

      const checkPageBreak = (needed = LINE * 3) => {
        if (y + needed > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage()
          y = margin
        }
      }

      // Title
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('Menu Engineer Report', margin, y)
      y += LINE + 4

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text(`Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y)
      y += LINE * 1.5

      // Summary bar
      doc.setTextColor(17, 24, 39)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const summaryLine = `${data.summary.totalItems} items \u00b7 Avg margin: ${symbol}${Number(data.summary.averageContributionMargin).toFixed(2)} \u00b7 Stars: ${data.summary.stars} \u00b7 Puzzles: ${data.summary.puzzles} \u00b7 Plowhorses: ${data.summary.plowhorses} \u00b7 Dogs: ${data.summary.dogs}`
      doc.text(summaryLine, margin, y, { maxWidth })
      y += LINE + SECTION_GAP

      // Category sections
      const CATEGORIES = ['Star', 'Puzzle', 'Plowhorse', 'Dog']

      CATEGORIES.forEach((cat) => {
        const items = data.items.filter((i) => i.category === cat)
        if (items.length === 0) return

        checkPageBreak(LINE * 3)
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(17, 24, 39)
        doc.text(`${cat}s (${items.length})`, margin, y)
        y += LINE + 6

        items.forEach((item) => {
          checkPageBreak(LINE * 5)

          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(17, 24, 39)
          doc.text(item.name, margin, y)
          y += LINE

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(10)
          doc.setTextColor(55, 65, 81)
          doc.text(
            `Price: ${symbol}${Number(item.price).toFixed(2)}  \u00b7  Food cost: ${item.foodCostPct}%  \u00b7  Margin: ${symbol}${Number(item.contributionMargin).toFixed(2)}`,
            margin, y
          )
          y += LINE

          const actionLines = doc.splitTextToSize(`\u2192 ${item.action}`, maxWidth)
          doc.setTextColor(17, 24, 39)
          doc.text(actionLines, margin, y)
          y += LINE * actionLines.length

          if (item.marketContext) {
            doc.setTextColor(107, 114, 128)
            const ctxLines = doc.splitTextToSize(item.marketContext, maxWidth)
            doc.text(ctxLines, margin, y)
            y += LINE * ctxLines.length
          }

          y += 10
        })

        y += SECTION_GAP - 10
      })

      // Price table
      checkPageBreak(LINE * 6)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      doc.text('Price Adjustment Map', margin, y)
      y += LINE + 6

      const colWidths = [160, 80, 60, 80, 70, 90]
      const headers = ['Item', 'Category', 'Price', 'Food Cost', 'Margin', 'Action']

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(107, 114, 128)
      let x = margin
      headers.forEach((h, i) => {
        doc.text(h, x, y)
        x += colWidths[i]
      })
      y += LINE

      const sortedItems = [...data.items].sort(
        (a, b) => Number(a.contributionMargin) - Number(b.contributionMargin)
      )

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(17, 24, 39)

      sortedItems.forEach((item) => {
        checkPageBreak(LINE * 2)
        x = margin
        const recLabel = item.priceRecommendation === 'raise' ? 'Raise' : item.priceRecommendation === 'cut' ? 'Cut' : 'Hold'
        const row = [
          item.name,
          item.category,
          `${symbol}${Number(item.price).toFixed(2)}`,
          `${item.foodCostPct}%`,
          `${symbol}${Number(item.contributionMargin).toFixed(2)}`,
          recLabel
        ]
        row.forEach((cell, i) => {
          doc.text(String(cell), x, y)
          x += colWidths[i]
        })
        y += LINE
      })

      doc.save('menu-engineer-report.pdf')
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      type="button"
      className="button pdf-button"
      onClick={handleDownload}
      disabled={generating}
      aria-label="Download analysis as PDF"
    >
      {generating ? 'Generating PDF...' : '\u2193 Download PDF Report'}
    </button>
  )
}
