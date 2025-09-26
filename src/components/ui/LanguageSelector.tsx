import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Globe,
  Check,
  ChevronDown
} from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪', rtl: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
]

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
    
    // Update document direction for RTL languages
    const selectedLang = languages.find(lang => lang.code === languageCode)
    if (selectedLang?.rtl) {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = languageCode
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = languageCode
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
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
          <div className="absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded-lg shadow-lg z-50">
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
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
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
                More languages coming soon
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}