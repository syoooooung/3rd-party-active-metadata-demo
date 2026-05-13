import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { driver, type DriveStep } from 'driver.js'
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

export interface OnboardingTourRef {
  startTour: () => void
}

const OnboardingTour = forwardRef<OnboardingTourRef, OnboardingTourProps>(
  ({ steps, tourKey, onComplete }, ref) => {
    const startDriverTour = () => {
      console.log('[OnboardingTour] Starting driver with steps:', steps)

      try {
        const driverObj = driver({
          showProgress: true,
          showButtons: ['next', 'previous', 'close'],
          steps: steps as DriveStep[],
          nextBtnText: '다음',
          prevBtnText: '이전',
          doneBtnText: '완료',
          progressText: '{{current}}/{{total}}',
          onDestroyed: () => {
            console.log('[OnboardingTour] Tour completed')
            localStorage.setItem(tourKey, 'true')
            onComplete?.()
          },
          popoverClass: 'onboarding-driver-popover',
        })

        driverObj.drive()
      } catch (error) {
        console.error('[OnboardingTour] Error starting driver:', error)
      }
    }

    // Expose startTour method to parent components
    useImperativeHandle(ref, () => ({
      startTour: startDriverTour,
    }))

    useEffect(() => {
      // Check if user has already seen this tour
      const hasSeenTour = localStorage.getItem(tourKey)
      console.log('[OnboardingTour]', { tourKey, hasSeenTour, stepsCount: steps.length })

      if (!hasSeenTour) {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          startDriverTour()
        }, 500)

        return () => clearTimeout(timer)
      }
    }, [steps, tourKey, onComplete])

    return null
  }
)

OnboardingTour.displayName = 'OnboardingTour'

export default OnboardingTour
