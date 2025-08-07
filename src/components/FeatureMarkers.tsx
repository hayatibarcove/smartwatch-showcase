'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'

interface Feature {
  id: string
  title: string
  description: string
  position: [number, number, number]
  triggerRotation: number // Rotation angle when this feature should appear (0-1)
}

const features: Feature[] = [
  {
    id: 'heart-rate',
    title: 'Heart Rate Monitor',
    description: 'Advanced optical sensor tracks your heart rate 24/7 with medical-grade accuracy.',
    position: [1.5, 0.5, 0],
    triggerRotation: 0.2,
  },
  {
    id: 'fitness-tracking',
    title: 'Fitness Tracking',
    description: 'Comprehensive workout tracking with over 100 exercise modes and automatic detection.',
    position: [-1.5, 0.5, 0],
    triggerRotation: 0.4,
  },
  {
    id: 'sleep-monitoring',
    title: 'Sleep Analysis',
    description: 'Detailed sleep tracking with REM, deep sleep phases, and smart wake-up features.',
    position: [0, 1.5, 1],
    triggerRotation: 0.6,
  },
  {
    id: 'water-resistant',
    title: 'Water Resistant',
    description: '50m water resistance for swimming, diving, and all-weather adventures.',
    position: [0, -1.5, -1],
    triggerRotation: 0.8,
  },
]

interface FeatureMarkerProps {
  feature: Feature
  isVisible: boolean
  onHover: (hovered: boolean) => void
}

function FeatureMarker({ feature, isVisible, onHover }: FeatureMarkerProps) {
  const markerRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (markerRef.current) {
      // Floating animation
      markerRef.current.position.y = feature.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Scale animation based on visibility and hover
      const targetScale = isVisible ? (hovered ? 1.2 : 1) : 0
      markerRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const handlePointerOver = () => {
    setHovered(true)
    onHover(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover(false)
  }

  return (
    <group
      ref={markerRef}
      position={[feature.position[0], feature.position[1], feature.position[2]]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Marker sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#FFD700" : "#D4AF37"}
          emissive={hovered ? "#FFD700" : "#D4AF37"}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color="#D4AF37"
          transparent
          opacity={isVisible ? (hovered ? 0.3 : 0.1) : 0}
        />
      </mesh>
      
      {/* Connection line to watch center */}
      {isVisible && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                feature.position[0], feature.position[1], feature.position[2],
                0, 0, 0 // Watch center
              ])}
              itemSize={3}
              args={[new Float32Array([
                feature.position[0], feature.position[1], feature.position[2],
                0, 0, 0 // Watch center
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#D4AF37" 
            transparent 
            opacity={hovered ? 0.6 : 0.3}
          />
        </line>
      )}
      
      {/* Feature description panel */}
      {isVisible && hovered && (
        <Html
          position={[feature.position[0] > 0 ? 0.5 : -0.5, 0.3, 0]}
          transform
          occlude
          style={{ pointerEvents: 'none' }}
        >
          <div className="glass-effect text-white p-4 rounded-lg max-w-xs">
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-[#AAAAAA]">{feature.description}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

interface FeatureMarkersProps {
  scrollProgress: number
}

export default function FeatureMarkers({ scrollProgress }: FeatureMarkersProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const handleHover = (featureId: string, hovered: boolean) => {
    setHoveredFeature(hovered ? featureId : null)
  }

  return (
    <group>
      {features.map((feature) => {
        const isVisible = scrollProgress >= feature.triggerRotation && 
                         scrollProgress <= feature.triggerRotation + 0.2
        
        return (
          <FeatureMarker
            key={feature.id}
            feature={feature}
            isVisible={isVisible}
            onHover={(hovered) => handleHover(feature.id, hovered)}
          />
        )
      })}
    </group>
  )
}