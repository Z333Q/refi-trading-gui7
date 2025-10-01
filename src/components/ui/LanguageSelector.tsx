import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { 
  Globe,
  Check,
  ChevronDown
} from 'lucide-react'
import { languages } from '@/config/languages'

/**
 * Language Selector Component
 * 
 * Provides a dropdown interface for changing the application language.
 * Supports RTL languages and persists language preference.
 */
export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  /**
   * Handle language change with proper RTL support and persistence
   */
  const handleLanguageChange = async (languageCode: string) => {
    try {
      console.log('Changing language to:', languageCode)
      
      // Change the language
      await i18n.changeLanguage(languageCode)
      
      // Update document direction for RTL languages
      const selectedLang = languages.find(lang => lang.code === languageCode)
      if (selectedLang?.rtl) {
        document.documentElement.dir = 'rtl'
        document.documentElement.lang = languageCode
      } else {
        document.documentElement.dir = 'ltr'
        document.documentElement.lang = languageCode
      }
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', languageCode)
      
      // Force a complete re-render by reloading the page
      // This ensures all components update with the new language
      window.location.reload()
      
    } catch (error) {
      console.error('Error changing language:', error)
      // Fallback: reload the page
      window.location.reload()
    }
    
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                    i18n.language === language.code
                      ? 'bg-emerald-950/20 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  aria-label={`Switch to ${language.name}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg" role="img" aria-label={`${language.name} flag`}>
                      {language.flag}
                    </span>
                    <span>{language.name}</span>
                  </div>
                  {i18n.language === language.code && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-800 p-2">
              <div className="text-xs text-gray-500 px-3 py-1">
                {languages.length} languages supported
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}