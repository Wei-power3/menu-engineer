import { useState } from 'react'
import { analyzeMenu } from '../utils/menuAnalysis'

export default function useMenuAnalysis() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const runAnalysis = (items, market) => {
    try {
      const result = analyzeMenu(items, market)
      setData(result)
      setError('')
    } catch (err) {
      setError(err.message || 'Analysis failed. Please check your inputs.')
    }
  }

  return {
    data,
    error,
    loading: false, // instant — no async call
    analyzeMenu: runAnalysis,
    clearData: () => { setData(null); setError('') },
  }
}
