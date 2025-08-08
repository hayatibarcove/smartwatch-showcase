'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobile, getResponsiveCameraParams } from '../hooks/useResponsiveCamera'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface CameraPosition {
  x: number
  y: number
  z: number
  lookAtX?: number
  lookAtY?: number
  lookAtZ?: number
}

export interface FeatureSegment {
  id: string
  title: string
  description: string
  startProgress: number
  endProgress: number
  markerPosition: [number, number, number]
  markerColor: string
  cameraPosition: CameraPosition
}

// Enhanced feature segments with precise marker positions close to watch components
export const featureSegments: FeatureSegment[] = [
  {
    id: 'display',
    title: 'Ultra-clear AMOLED Display',
    description: 'Ultra-clear AMOLED display with adaptive brightness for perfect visibility in any lighting conditions.',
    startProgress: 0,
    endProgress: 0.2,
    markerPosition: [-0.15, 0, 0.1], // Close to watch face center
    markerColor: '#D4AF37',
    cameraPosition: { x: 0, y: 0, z: 5, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }
  },
  {
    id: 'usb-slot',
    title: 'USB-C Charging Slot',
    description: 'USB-C charging slot with seamless integration for efficient and secure docking.',
    startProgress: 0.2,
    endProgress: 0.35,
    markerPosition: [0.55, -0.2, 0], // Close to right side where USB typically is
    markerColor: '#D4AF37',
    cameraPosition: { x: 5, y: 0, z: 0, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }
  },
  {
    id: 'rotary-button',
    title: 'Precision Rotary Crown',
    description: 'Precision rotary crown with shortcut support for effortless navigation and control.',
    startProgress: 0.35,
    endProgress: 0.5,
    markerPosition: [0.55, 0.2, -0.3], // Close to crown position on right side
    markerColor: '#D4AF37',
    cameraPosition: { x: 5, y: 0, z: 0, lookAtX: 0, lookAtY: 0, lookAtZ: 0 } // Same as USB slot
  },
  {
    id: 'heart-rate',
    title: 'Optical Heart Rate Sensor',
    description: 'Optical sensor for continuous heart rate monitoring and accurate health insights.',
    startProgress: 0.5,
    endProgress: 0.7,
    markerPosition: [-0.1, -0.1, -0.4], // Close to back center where sensors are
    markerColor: '#D4AF37',
    cameraPosition: { x: 2, y: 0.5, z: -2, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }
  },
  {
    id: 'strap',
    title: 'Adjustable Comfort Strap',
    description: 'Adjustable fit clasp and interchangeable straps for comfort and personalization.',
    startProgress: 0.7,
    endProgress: 0.9,
    markerPosition: [-0.2, 0.5, -1.8], // Close to strap attachment points
    markerColor: '#D4AF37',
    cameraPosition: { x: 0, y: 4, z: -8, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }
  },
  {
    id: 'return-front',
    title: '',
    description: '',
    startProgress: 0.9,
    endProgress: 0.95,
    markerPosition: [0, 0.5, 0.8],
    markerColor: '#D4AF37',
    cameraPosition: { x: -4, y: 2, z: -2, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }
  },
  {
    id: 'return-front-2',
    title: '',
    description: '',
    startProgress: 0.95,
    endProgress: 1,
    markerPosition: [0, 0.5, 0.8],
    markerColor: '#D4AF37',
    cameraPosition: { x: -6, y: 0, z: 0, lookAtX: 0, lookAtY: 0, lookAtZ: 0 }
  }
]

// Calculate smooth camera position interpolation for continuous 360-degree orbit
function calculateCameraPosition(progress: number): CameraPosition {
  // Find current and next feature segments
  const currentSegmentIndex = featureSegments.findIndex(segment => 
    progress >= segment.startProgress && progress < segment.endProgress
  )
  
  let currentSegment = featureSegments[currentSegmentIndex]
  let nextSegment = featureSegments[currentSegmentIndex + 1]
  
  // Handle edge cases
  if (!currentSegment) {
    if (progress < 0.2) {
      currentSegment = featureSegments[0]
      nextSegment = featureSegments[1]
    } else if (progress >= 0.9) {
      currentSegment = featureSegments[featureSegments.length - 1]
      nextSegment = featureSegments[0] // Loop back to first
    } else {
      // Find the closest segment
      const closestSegment = featureSegments.reduce((closest, segment) => {
        const segmentCenter = (segment.startProgress + segment.endProgress) / 2
        const currentDistance = Math.abs(progress - segmentCenter)
        const closestDistance = Math.abs(progress - (closest.startProgress + closest.endProgress) / 2)
        return currentDistance < closestDistance ? segment : closest
      })
      currentSegment = closestSegment
      nextSegment = featureSegments[(featureSegments.indexOf(closestSegment) + 1) % featureSegments.length]
    }
  }
  
  // If no next segment, use current segment
  if (!nextSegment) {
    nextSegment = currentSegment
  }
  
  // Calculate progress within current segment
  const segmentProgress = currentSegment ? 
    Math.max(0, Math.min(1, (progress - currentSegment.startProgress) / (currentSegment.endProgress - currentSegment.startProgress))) : 0
  
  // Interpolate between current and next segment camera positions
  const currentPos = currentSegment?.cameraPosition || { x: 0, y: 0, z: 5 }
  const nextPos = nextSegment?.cameraPosition || { x: 0, y: 0, z: 5 }
  
  // Use GSAP's power1.inOut easing for smooth transitions
  const easedProgress = gsap.utils.interpolate(0, 1, segmentProgress)
  
  const x = gsap.utils.interpolate(currentPos.x, nextPos.x, easedProgress)
  const y = gsap.utils.interpolate(currentPos.y, nextPos.y, easedProgress)
  const z = gsap.utils.interpolate(currentPos.z, nextPos.z, easedProgress)
  
  // Apply responsive scaling for mobile devices
  const { radius, height } = getResponsiveCameraParams()
  const mobile = isMobile()
  
  const responsiveX = x * (mobile ? radius / 40 : 1)
  const responsiveY = y * (mobile ? height / 10 : 1)
  const responsiveZ = z * (mobile ? radius / 40 : 1)
  
  // Reduced debug logging for orbit verification
  if (process.env.NODE_ENV === 'development' && progress % 0.25 < 0.01) {
    console.log(`🌍 Orbit: ${(progress * 100).toFixed(0)}% | ${currentSegment?.id || 'none'} | (${responsiveX.toFixed(1)}, ${responsiveY.toFixed(1)}, ${responsiveZ.toFixed(1)})`)
  }
  
  return {
    x: responsiveX,
    y: responsiveY,
    z: responsiveZ,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0
  }
}

interface ScrollAnimationProps {
  onScrollProgress: (progress: number) => void
  onCameraUpdate: (position: CameraPosition) => void
  onFeatureUpdate: (activeSegment: FeatureSegment | null) => void
  children: React.ReactNode
}

export default function ScrollAnimation({ 
  onScrollProgress, 
  onCameraUpdate, 
  onFeatureUpdate, 
  children 
}: ScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const callbacksRef = useRef({ onScrollProgress, onCameraUpdate, onFeatureUpdate })
  
  // Update callbacks ref without triggering re-render
  useEffect(() => {
    callbacksRef.current = { onScrollProgress, onCameraUpdate, onFeatureUpdate }
  })

  useEffect(() => {
    if (!containerRef.current) return

    // Kill existing timeline and all ScrollTriggers
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    console.log('🚀 Initializing ScrollTrigger...')

    // Create master GSAP timeline with scroll-driven animation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile() ? 0.8 : 0.5, // Adjust scrub value for better performance
        pin: false,
        markers: false, // Disable markers to reduce console noise
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Use callback refs to avoid dependency issues
          const { onScrollProgress, onCameraUpdate, onFeatureUpdate } = callbacksRef.current
          
          onScrollProgress(progress)
          
          // Calculate camera position for continuous 360-degree orbit
          const cameraPosition = calculateCameraPosition(progress)
          onCameraUpdate(cameraPosition)
          
          // Find active feature segment (excluding return-front)
          const activeSegment = featureSegments.find(segment => 
            progress >= segment.startProgress && progress < segment.endProgress && !['return-front', 'return-front-2'].includes(segment.id)
          )
          
          onFeatureUpdate(activeSegment || null)
        }
      }
    })

    // Add timeline labels for each feature segment
    featureSegments.forEach((segment, index) => {
      const label = `feature-${segment.id}`
      timeline.addLabel(label, segment.startProgress)
      
      // Add smooth transitions between segments
      if (index < featureSegments.length - 1) {
        const nextSegment = featureSegments[index + 1]
        const transitionDuration = nextSegment.startProgress - segment.endProgress
        
        if (transitionDuration > 0) {
          timeline.addLabel(`transition-${segment.id}`, segment.endProgress)
        }
      }
    })

    timelineRef.current = timeline
    console.log('✅ ScrollTrigger initialized')

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, []) // Remove dependencies that cause re-renders

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ 
        touchAction: 'pan-y'
      }}
    >
      {children}
      
      {/* Invisible scroll sections to create scrollable height */}
      <div className="relative z-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="h-screen opacity-0" />
        ))}
      </div>
      
    </div>
  )
}