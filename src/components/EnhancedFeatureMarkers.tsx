'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { featureSegments, FeatureSegment } from './ScrollAnimation'

interface FeatureMarkerProps {
  segment: FeatureSegment
  isActive: boolean
  markerOpacity: number
  panelOpacity: number
  onHover: (hovered: boolean) => void
}

function FeatureMarker({ segment, isActive, markerOpacity, panelOpacity, onHover }: FeatureMarkerProps) {
  const markerRef = useRef<THREE.Group>(null)
  const dotRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (markerRef.current) {
      // Subtle floating animation
      const time = state.clock.elapsedTime
      const floatIntensity = isActive ? 0.08 : 0.03
      markerRef.current.position.y = segment.markerPosition[1] + Math.sin(time * 1.5 + segment.markerPosition[0]) * floatIntensity
      
      // Gentle scale animation based on activity and hover
      const targetScale = isActive ? (hovered ? 1.2 : 1.0) : 0.6
      markerRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08)
    }

    // Elegant glow animation for active markers
    if (glowRef.current && isActive) {
      const glowIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = markerOpacity * glowIntensity * (hovered ? 1.5 : 1.0)
    }

    // Subtle dot emissive animation
    if (dotRef.current) {
      const material = dotRef.current.material as THREE.MeshStandardMaterial
      const emissiveIntensity = isActive ? (hovered ? 0.8 : 0.4) : 0.1
      material.emissiveIntensity = emissiveIntensity
    }
  })

  const handlePointerOver = () => {
    setHovered(true)
    onHover(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      ref={markerRef}
      position={segment.markerPosition}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Elegant glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color="#D4AF37"
          transparent
          opacity={0}
        />
      </mesh>

      {/* Minimalist dot marker */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial 
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

interface DescriptionPanelProps {
  segment: FeatureSegment
  isActive: boolean
  panelOpacity: number
  isHovered: boolean
  isMobile?: boolean
}

function DescriptionPanel({ segment, isActive, panelOpacity, isHovered, isMobile = false }: DescriptionPanelProps) {
  const panelRef = useRef<THREE.Group>(null)
  const backgroundRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (panelRef.current) {
      // Subtle floating animation
      const time = state.clock.elapsedTime
      const floatIntensity = isMobile ? 0.03 : 0.06
      panelRef.current.position.y = segment.markerPosition[1] + 1.2 + Math.sin(time * 1.2) * floatIntensity
      
      // Gentle scale animation with smooth transitions
      const targetScale = (isActive && (isHovered || panelOpacity > 0.5)) ? 1.0 : 0
      const lerpSpeed = isMobile ? 0.08 : 0.12
      panelRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), lerpSpeed)
    }

    // Subtle background animation
    if (backgroundRef.current) {
      const material = backgroundRef.current.material as THREE.MeshBasicMaterial
      material.opacity = panelOpacity * (isHovered ? 0.9 : 0.7)
    }
  })

  // Elegant panel positioning
  const getPanelPosition = (): [number, number, number] => {
    const baseX = segment.markerPosition[0]
    const baseY = segment.markerPosition[1] + 1.2
    const baseZ = segment.markerPosition[2]
    
    // Simple positioning to avoid overlap
    let offsetX = 1.5
    if (baseX > 0) {
      offsetX = 1.5 // Right side
    } else if (baseX < 0) {
      offsetX = -1.5 // Left side
    } else {
      // Center markers - alternate left/right
      offsetX = segment.id.includes('display') || segment.id.includes('strap') ? 1.5 : -1.5
    }
    
    return [baseX + offsetX, baseY, baseZ]
  }

  const panelPosition = getPanelPosition()

  return (
    <Billboard position={panelPosition}>
      <group ref={panelRef}>
        {/* Clean background panel */}
        <mesh ref={backgroundRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[2.6, 1.2]} />
          <meshBasicMaterial 
            color="#000000"
            transparent
            opacity={0}
          />
        </mesh>

        {/* Subtle border */}
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[2.62, 1.22]} />
          <meshBasicMaterial 
            color="#D4AF37"
            transparent
            opacity={panelOpacity * 0.3}
          />
        </mesh>

        {/* Clean title */}
        <Text
          position={[0, 0.25, 0]}
          fontSize={0.12}
          maxWidth={2.4}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {segment.title}
        </Text>

        {/* Elegant description */}
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.08}
          maxWidth={2.4}
          lineHeight={1.2}
          letterSpacing={0.01}
          textAlign="center"
          color="#AAAAAA"
          anchorX="center"
          anchorY="middle"
        >
          {segment.description}
        </Text>

        {/* Minimalist indicator dot */}
        <mesh position={[0, -0.45, 0]}>
          <circleGeometry args={[0.03, 8]} />
          <meshBasicMaterial 
            color="#D4AF37"
            transparent
            opacity={panelOpacity}
          />
        </mesh>
      </group>
    </Billboard>
  )
}

interface EnhancedFeatureMarkersProps {
  scrollProgress: number
  activeFeature: FeatureSegment | null
}

export default function EnhancedFeatureMarkers({ scrollProgress, activeFeature }: EnhancedFeatureMarkersProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleHover = (featureId: string, hovered: boolean) => {
    // Enhanced hover effects with better performance on mobile
    if (!isMobile) {
      setHoveredFeature(hovered ? featureId : null)
    }
  }

  return (
    <group>
      {featureSegments
        .filter(segment => !['return-front', 'return-front-2'].includes(segment.id)) // Filter out return-front segment
        .map((segment) => {
        const isActive = activeFeature?.id === segment.id
        const isHovered = hoveredFeature === segment.id
        
        // Enhanced opacity calculation based on scroll progress and activity
        const segmentProgress = Math.max(0, Math.min(1, 
          (scrollProgress - segment.startProgress) / (segment.endProgress - segment.startProgress)
        ))
        
        // Enhanced marker visibility logic for 360-degree orbit
        const markerOpacity = isActive ? 1 : 
          (scrollProgress >= segment.startProgress && scrollProgress <= segment.endProgress) ? 
          Math.sin(segmentProgress * Math.PI) * 0.8 : 0.2

        // Enhanced panel visibility logic with better timing for orbit experience
        const panelOpacity = isMobile 
          ? (isActive && segmentProgress > 0.2 ? 1 : 0)
          : (isActive && (isHovered || segmentProgress > 0.3) ? 1 : 0)
        
        // Enhanced orbit-specific visibility for better user experience
        const isInOrbitRange = scrollProgress >= segment.startProgress - 0.05 && 
                              scrollProgress <= segment.endProgress + 0.05
        
        const orbitAdjustedOpacity = isInOrbitRange ? markerOpacity : markerOpacity * 0.4
        
        return (
          <group key={segment.id}>
            <FeatureMarker
              segment={segment}
              isActive={isActive}
              markerOpacity={orbitAdjustedOpacity}
              panelOpacity={panelOpacity}
              onHover={(hovered) => handleHover(segment.id, hovered)}
            />
            
            {/* Enhanced 3D panels with better performance handling */}
            {/* {!isMobile && (
              <DescriptionPanel
                segment={segment}
                isActive={isActive}
                panelOpacity={panelOpacity}
                isHovered={isHovered}
                isMobile={isMobile}
              />
            )} */}
          </group>
        )
      })}
    </group>
  )
}