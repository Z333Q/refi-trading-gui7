import React, { Suspense, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { LoadingSpinner } from './LoadingSpinner'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isI18nReady, setIsI18nReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Wait for i18next to be fully initialized
        if (!i18n.isInitialized) {
          await i18n.init()
        }
        
        // Set up RTL for initial language
        const currentLang = i18n.language
        const rtlLanguages = ['ar', 'he', 'fa', 'ur']
        
        if (rtlLanguages.includes(currentLang)) {
          document.documentElement.dir = 'rtl'
        } else {
          document.documentElement.dir = 'ltr'
        }
        
        document.documentElement.lang = currentLang
        
        setIsI18nReady(true)
      } catch (err) {
        console.error('Failed to initialize i18n:', err)
        setError('Failed to load translations')
        // Still set as ready to prevent infinite loading
        setIsI18nReady(true)
      }
    }

    initializeI18n()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Translation Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isI18nReady) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-emerald-500 mb-4" />
          <p className="text-gray-400">Loading translations...</p>
        </div>
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-900 text-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-emerald-500 mb-4" />
            <p className="text-gray-400">Preparing interface...</p>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </I18nextProvider>
  )
}