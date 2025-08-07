'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface CTAButtonProps {
  scrollProgress: number
}

export default function CTAButton({ scrollProgress }: CTAButtonProps) {
  const buttonRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  // Show CTA when scroll is near the end
  const isVisible = scrollProgress > 0.9

  useFrame((state) => {
    if (buttonRef.current) {
      // Floating animation
      buttonRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      
      // Scale animation
      const targetScale = isVisible ? (hovered ? 1.1 : 1) : 0
      buttonRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      
      // Gentle rotation
      buttonRef.current.rotation.y += 0.01
    }
  })

  const handleClick = () => {
    // Handle CTA action - could open a modal, redirect, etc.
    console.log('CTA clicked - Order now!')
    // For demo purposes, just log. In real app, handle purchase flow
    alert('Order now functionality would be implemented here!')
  }

  return (
    <group
      ref={buttonRef}
      position={[0, -2, 2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* 3D Button Base */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#FFD700" : "#D4AF37"}
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? "#FFD700" : "#D4AF37"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Button Ring */}
      <mesh>
        <torusGeometry args={[0.9, 0.05, 8, 32]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow Effect */}
      <mesh>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshBasicMaterial 
          color="#D4AF37"
          transparent
          opacity={isVisible ? (hovered ? 0.3 : 0.15) : 0}
        />
      </mesh>
      
      {/* HTML Overlay for text */}
      {isVisible && (
        <Html
          transform
          occlude
          position={[0, 0, 0.15]}
          style={{ 
            pointerEvents: hovered ? 'auto' : 'none',
            userSelect: 'none'
          }}
        >
          <div 
            className="text-center cursor-pointer"
            onClick={handleClick}
          >
            <div className="text-white font-bold text-lg mb-1">
              ORDER NOW
            </div>
            <div className="text-[#D4AF37] text-sm">
              Starting at $299
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}