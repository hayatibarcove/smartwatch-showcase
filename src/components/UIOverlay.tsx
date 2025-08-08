'use client'

import { FeatureSegment, featureSegments } from './ScrollAnimation'
import { useState, useCallback } from 'react'
import OverlayDrawer from './OverlayDrawer'

interface UIOverlayProps {
  scrollProgress: number
  activeFeature: FeatureSegment | null
}

export default function UIOverlay({ scrollProgress, activeFeature }: UIOverlayProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Drawer component (higher z-index than overlay UI) */}
      <OverlayDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      {/* Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 pointer-events-auto text-center md:text-left">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          SMARTWATCH
          <span className="text-[#D4AF37]">PRO</span>
        </h1>
      </div>
      
      {/* Menu */}
      {/* <div className="absolute top-6 right-6 pointer-events-auto">
        <nav className="flex space-x-6">
          <a href="#features" className="text-white hover:text-[#D4AF37] transition-colors duration-300">
            Features
          </a>
          <a href="#specs" className="text-white hover:text-[#D4AF37] transition-colors duration-300">
            Specs
          </a>
        </nav>
      </div> */}
      
      {/* Enhanced Progress Bar with Feature Segments */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:block">
        <div className="relative">
          {/* Main progress track */}
          <div className="w-1 h-64 bg-[#2E2E2E] rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="w-full bg-gradient-to-t from-[#D4AF37] via-[#FFD700] to-[#D4AF37] transition-all duration-500 ease-out rounded-full shadow-lg"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          
          {/* Feature segment indicators with enhanced styling */}
          <div className="absolute inset-0">
            {featureSegments
              .filter(segment => !['return-front', 'return-front-2'].includes(segment.id)) // Filter out return-front segment
              .map((segment, index) => {
              const isActive = activeFeature?.id === segment.id
              const segmentY = (segment.startProgress + segment.endProgress) / 2 * 100
              
              return (
                <div
                  key={segment.id}
                  className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'scale-150 shadow-lg animate-gold-pulse' 
                      : scrollProgress >= segment.startProgress 
                        ? 'scale-100' 
                        : 'scale-75 opacity-50'
                  }`}
                  style={{ 
                    top: `${segmentY}%`,
                    backgroundColor: '#D4AF37',
                    boxShadow: isActive ? '0 0 20px #D4AF37' : 'none'
                  }}
                />
              )
            })}
          </div>
          
          {/* Enhanced progress percentage */}
          <div className="absolute -right-12 top-0 text-[#D4AF37] text-sm font-mono font-bold">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar (Horizontal) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 md:hidden">
        <div className="relative">
          <div className="h-1 bg-[#2E2E2E] rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          
          {/* Mobile segment indicators */}
          <div className="absolute inset-0">
            {featureSegments
              .filter(segment => !['return-front', 'return-front-2'].includes(segment.id)) // Filter out return-front segment
              .map((segment, index) => {
              const isActive = activeFeature?.id === segment.id
              const segmentX = (segment.startProgress + segment.endProgress) / 2 * 100
              
              return (
                <div
                  key={segment.id}
                  className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'scale-150' : 'scale-100'
                  }`}
                  style={{ 
                    left: `${segmentX}%`,
                    backgroundColor: '#D4AF37',
                    transform: `translateX(-50%) translateY(-50%) ${isActive ? 'scale(1.5)' : 'scale(1)'}`
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Professional scroll hint (visible only at start) */}
      {scrollProgress < 0.05 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          {/* Elegant background container */}
          <div className="glass-effect rounded-2xl backdrop-blur-md border border-[#D4AF37]/20">
            {/* Refined typography */}
            <div className="text-[#D4AF37] text-sm font-medium tracking-wide mb-3">
              Explore the 360° Experience
            </div>
            
            {/* Sophisticated scroll indicator */}
            <div className="flex flex-col items-center space-y-2">
              {/* Elegant scroll icon */}
              <div className="relative" style={{margin: '8px 0'}}>
                {/* Outer ring */}
                <div className="w-8 h-12 border border-[#D4AF37]/40 rounded-full relative">
                  {/* Inner scroll bar */}
                  <div className="w-1.5 h-4 bg-gradient-to-b from-[#D4AF37] to-[#FFD700] rounded-full absolute top-2 left-1/2 -translate-x-1/2 animate-bounce" />
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 w-8 h-12 border border-[#D4AF37]/20 rounded-full animate-pulse" />
              </div>
              
              {/* Refined instruction text */}
              <div className="text-[#AAAAAA] text-xs font-light tracking-wide">
                Scroll to navigate
              </div>
            </div>
          </div>
          
          {/* Subtle fade-in animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#0E0E0E]/20 rounded-2xl" />
        </div>
      )}
      
      {/* Enhanced Feature Display */}
      {scrollProgress >= 0.05 && (
          <div className="absolute bottom-6 right-6 max-w-md hidden md:block">
        {activeFeature ? (
          <div className="glass-effect rounded-xl p-6 transition-all duration-500 animate-float">
            <div className="flex items-center mb-3">
              <div 
                className="w-3 h-3 rounded-full mr-3 shadow-md animate-gold-pulse"
                style={{ 
                  backgroundColor: '#D4AF37',
                  boxShadow: '0 0 10px #D4AF37'
                }}
              />
              <h2 className="text-xl font-semibold text-white">{activeFeature.title}</h2>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed text-sm">{activeFeature.description}</p>
            
            {/* Progress within current segment */}
            <div className="mt-4">
              <div className="w-full h-1 bg-[#2E2E2E] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: '#D4AF37',
                    width: `${Math.max(0, Math.min(100, 
                      ((scrollProgress - activeFeature.startProgress) / 
                       (activeFeature.endProgress - activeFeature.startProgress)) * 100
                    ))}%`
                  }}
                />
              </div>
            </div>
            
            {/* Orbit progress indicator */}
            <div className="mt-3 text-xs text-[#AAAAAA]">
              Orbit Progress: {Math.round(scrollProgress * 100)}%
            </div>
          </div>
        ) : (
          <div className="glass-effect rounded-xl p-6 transition-all duration-500">
            <h2 className="text-xl font-semibold text-white mb-2">Smart Watch Pro</h2>
            <p className="text-[#AAAAAA]">Experience the future of wearable technology with cutting-edge features and elegant design.</p>
            <div className="mt-3 text-xs text-[#AAAAAA]">
              Scroll to explore the 360° showcase
            </div>
          </div>
        )}
      </div>)}

      {/* Mobile Feature Display */}
      {scrollProgress >= 0.05 && (
        <div className="absolute left-6 right-6 md:hidden" style={{ bottom: 'max(6vh, env(safe-area-inset-bottom) + 16px)' }}>
        {activeFeature ? (
          <div className="glass-effect rounded-xl p-4 transition-all duration-500">
            <div className="flex items-center mb-2">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#D4AF37' }}
              />
              <h2 className="text-lg font-semibold text-white">{activeFeature.title}</h2>
            </div>
            <p className="text-[#AAAAAA] text-sm leading-relaxed">{activeFeature.description}</p>
            <div className="mt-2 text-xs text-[#AAAAAA]">
              {Math.round(scrollProgress * 100)}% complete
            </div>
          </div>
          ) : (
            <div className="glass-effect rounded-xl p-4 transition-all duration-500">
              <h2 className="text-lg font-semibold text-white mb-1">Smart Watch Pro</h2>
              <p className="text-[#AAAAAA] text-sm">Experience the future of wearable technology with cutting-edge features and elegant design.</p>
              <div className="mt-2 text-xs text-[#AAAAAA]">
                Scroll to explore the 360° showcase
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Navigation Dots (Mobile-friendly) */}
      {/* <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-3 md:hidden">
        {featureSegments
          .filter(segment => !['return-front', 'return-front-2'].includes(segment.id)) // Filter out return-front segment
          .map((segment, index) => {
          const isActive = activeFeature?.id === segment.id
          
          return (
            <div
              key={segment.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive ? 'scale-150' : 'scale-100 opacity-60'
              }`}
              style={{ backgroundColor: '#D4AF37' }}
            />
          )
        })}
      </div> */}

      {/* Final CTA (appears at end) */}
      {scrollProgress === 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-auto md:right-2 md:left-auto md:translate-x-0 md:translate-y-0 md:max-w-md animate-fade-in text-center">
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-[#D4AF37] shadow-2xl mx-6 md:mx-0">
            <h3 className="text-2xl font-bold text-white mb-4">Experience the Future</h3>
            <p className="text-[#AAAAAA] mb-6">Ready to upgrade your lifestyle?</p>
            <button
              onClick={openDrawer}
              className="bg-[#D4AF37] text-[#0E0E0E] px-8 py-3 rounded-full font-semibold hover:bg-[#FFD700] transition-colors duration-300 pointer-events-auto"
            >
              Get Your Watch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}