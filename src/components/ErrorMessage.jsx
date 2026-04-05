import React from 'react'

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-box" role="alert">
      <p className="error-title">Something went wrong</p>
      <p className="error-detail">{message}</p>
      {onRetry && (
        <button type="button" className="button secondary error-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
