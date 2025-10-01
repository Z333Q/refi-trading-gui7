import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  HelpCircle, 
  BookOpen, 
  Star, 
  ExternalLink,
  CheckCircle,
  X
} from 'lucide-react'

import { tradingConcepts, type TradingConcept } from '@/config/tradingConcepts'

interface TradingConceptTooltipProps {
  concept: TradingConcept
  isVisible: boolean
  onClose: () => void
  onLearnMore: (conceptId: string) => void
  onClaimXP: (xp: number) => void
  position?: { x: number; y: number }
}

export function TradingConceptTooltip({ 
  concept, 
  isVisible, 
  onClose, 
  onLearnMore, 
  onClaimXP,
  position 
}: TradingConceptTooltipProps) {
  const [hasClaimedXP, setHasClaimedXP] = useState(false)

  const handleClaimXP = () => {
    onClaimXP(concept.xpReward)
    setHasClaimedXP(true)
  }

  if (!isVisible) return null

  const tooltipStyle = position ? {
    position: 'fixed' as const,
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -100%)',
    zIndex: 1000
  } : {}

  return (
    <div 
      className="absolute z-50"
      style={tooltipStyle}
    >
      <Card className="w-80 bg-gray-950/98 border-blue-800 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold text-blue-400">{concept.term}</h4>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={
                concept.difficulty === 'beginner' ? 'success' :
                concept.difficulty === 'intermediate' ? 'warning' : 'destructive'
              } className="text-xs">
                {concept.difficulty}
              </Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            {concept.definition}
          </p>
          
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800 mb-3">
            <h5 className="font-medium text-blue-400 mb-1 text-sm">Example:</h5>
            <p className="text-xs text-blue-300 leading-relaxed">{concept.example}</p>
          </div>
          
          {concept.relatedConcepts.length > 0 && (
            <div className="mb-3">
              <h5 className="font-medium text-gray-400 mb-2 text-sm">Related Concepts:</h5>
              <div className="flex flex-wrap gap-1">
                {concept.relatedConcepts.map((related, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {related}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLearnMore(concept.id)}
              className="text-blue-400 border-blue-600"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Learn More
            </Button>
            
            {!hasClaimedXP ? (
              <Button
                size="sm"
                onClick={handleClaimXP}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Star className="h-3 w-3 mr-1" />
                +{concept.xpReward} XP
              </Button>
            ) : (
              <Badge variant="success" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                XP Earned
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing concept tooltips
export function useTradingConceptTooltip() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | undefined>()

  const showTooltip = (conceptId: string, event?: React.MouseEvent) => {
    setActiveTooltip(conceptId)
    if (event) {
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY - 10
      })
    }
  }

  const hideTooltip = () => {
    setActiveTooltip(null)
    setTooltipPosition(undefined)
  }

  const getConcept = (conceptId: string) => tradingConcepts[conceptId]

  return {
    activeTooltip,
    tooltipPosition,
    showTooltip,
    hideTooltip,
    getConcept,
    tradingConcepts
  }
}

// Component for making text clickable with concept tooltips
interface ConceptLinkProps {
  conceptId: string
  children: React.ReactNode
  onShow: (conceptId: string, event: React.MouseEvent) => void
  className?: string
}

export function ConceptLink({ conceptId, children, onShow, className = "" }: ConceptLinkProps) {
  return (
    <span
      className={`cursor-pointer text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-2 ${className}`}
      onClick={(e) => onShow(conceptId, e)}
    >
      {children}
    </span>
  )
}