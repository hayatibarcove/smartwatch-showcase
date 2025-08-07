'use client'

import { useState, useEffect } from 'react'
import WatchScene from '../components/WatchScene'
import UIOverlay from '../components/UIOverlay'
import ScrollAnimation, { CameraPosition, FeatureSegment } from '../components/ScrollAnimation'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>({ x: 6, y: 2, z: 6 })
  const [activeFeature, setActiveFeature] = useState<FeatureSegment | null>(null)

  const handleScrollProgress = (progress: number) => {
    setScrollProgress(progress)
  }

  const handleCameraUpdate = (position: CameraPosition) => {
    setCameraPosition(position)
  }

  const handleFeatureUpdate = (segment: FeatureSegment | null) => {
    setActiveFeature(segment)
  }

  return (
    <main className="relative w-full">
      <ScrollAnimation 
        onScrollProgress={handleScrollProgress}
        onCameraUpdate={handleCameraUpdate}
        onFeatureUpdate={handleFeatureUpdate}
      >
        {/* 3D Scene - Fixed position covering the entire viewport */}
        <div className="fixed inset-0 w-full h-full bg-luxury-gradient z-0">
          <WatchScene 
            scrollProgress={scrollProgress} 
            cameraPosition={cameraPosition}
            activeFeature={activeFeature}
          />
        </div>
        
        {/* UI Overlay - Fixed position over the 3D scene */}
        <UIOverlay 
          scrollProgress={scrollProgress} 
          activeFeature={activeFeature}
        />
      </ScrollAnimation>
    </main>
  )
}
