import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || 'An error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-surface-200 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-surface-700 mb-6">{errorMessage}</p>
        <Link 
          to="/login" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage