import { useState } from 'react'

export default function useMenuAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const analyzeMenu = async ({ menuText, market }) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ menuText, market })
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = await response.json()
      setData(payload)
      return payload
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong while analyzing your menu.')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    data,
    analyzeMenu,
    clearData: () => setData(null)
  }
}
