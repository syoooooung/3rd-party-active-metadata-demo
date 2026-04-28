import { useState, useEffect } from 'react'
import './OnboardingTour.css'

export type TourStep = {
  title: string
  description: string
  details?: string[]
}

interface OnboardingTourProps {
  steps: TourStep[]
  tourKey: string // localStorage key to track if tour was completed
  onComplete: () => void
}

export default function OnboardingTour({ steps, tourKey, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already seen this tour
    const hasSeenTour = localStorage.getItem(tourKey)
    if (!hasSeenTour) {
      setIsVisible(true)
    }
  }, [tourKey])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem(tourKey, 'true')
    setIsVisible(false)
    onComplete()
  }

  const handleSkip = () => {
    localStorage.setItem(tourKey, 'true')
    setIsVisible(false)
    onComplete()
  }

  if (!isVisible) return null

  const step = steps[currentStep]

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <h2>{step.title}</h2>
          <button className="onboarding-close" onClick={handleSkip}>
            ✕
          </button>
        </div>

        <div className="onboarding-body">
          <p className="onboarding-description">{step.description}</p>

          {step.details && step.details.length > 0 && (
            <ul className="onboarding-details">
              {step.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-progress">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`progress-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            <button
              className="onboarding-button secondary"
              onClick={handleSkip}
            >
              건너뛰기
            </button>

            {currentStep > 0 && (
              <button
                className="onboarding-button secondary"
                onClick={handlePrevious}
              >
                이전
              </button>
            )}

            <button
              className="onboarding-button primary"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? '시작하기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
