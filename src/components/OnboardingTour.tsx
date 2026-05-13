import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './OnboardingTour.css'

export type TourStep = {
  element: string // CSS selector for the element to highlight
  popover: {
    title: string
    description: string
  }
}

interface OnboardingTourProps {
  steps: TourStep[]
  tourKey: string // localStorage key to track if tour was completed
  onComplete?: () => void
}

export default function OnboardingTour({ steps, tourKey, onComplete }: OnboardingTourProps) {
  useEffect(() => {
    // Check if user has already seen this tour
    const hasSeenTour = localStorage.getItem(tourKey)

    if (!hasSeenTour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          showButtons: ['next', 'previous', 'close'],
          steps: steps,
          nextBtnText: '다음',
          prevBtnText: '이전',
          doneBtnText: '완료',
          progressText: '{{current}}/{{total}}',
          onDestroyed: () => {
            localStorage.setItem(tourKey, 'true')
            onComplete?.()
          },
          popoverClass: 'onboarding-driver-popover',
        })

        driverObj.drive()
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [steps, tourKey, onComplete])

  return null
}
