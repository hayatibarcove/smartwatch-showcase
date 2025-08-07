'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useRef, useEffect } from 'react'
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { CameraPosition, FeatureSegment } from './ScrollAnimation'
import EnhancedFeatureMarkers from './EnhancedFeatureMarkers'
import { useResponsiveCamera, getResponsiveCameraParams, isMobile } from '../hooks/useResponsiveCamera'

// Fallback watch geometry component - now static, no rotation
function FallbackWatch() {
  const watchRef = useRef<THREE.Group>(null)

  return (
    <group ref={watchRef} position={[0, 0, 0]}>
      {/* Watch case */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Watch face */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          emissive="#0f0f23"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Watch band segments */}
      <mesh position={[0, 0, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 2]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, 0, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 2]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Digital crown */}
      <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Side button */}
      <mesh position={[1.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.06, 0.15, 0.06]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// Smart watch component - now static at center
function SmartWatch() {
  const { scene } = useGLTF('/models/smartwatch.glb')
  const watchRef = useRef<THREE.Group>(null)
  const { baseScale } = getResponsiveCameraParams()
  
  // Static watch model, enhanced with subtle animations
  useFrame((state) => {
    if (watchRef.current) {
      // Subtle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01
      watchRef.current.scale.setScalar(scale * baseScale)
    }
  })
  
  return <primitive ref={watchRef} object={scene} scale={[baseScale, baseScale, baseScale]} />
}

// Smart watch wrapper with error handling
function SmartWatchWrapper() {
  try {
    return <SmartWatch />
  } catch {
    return <FallbackWatch />
  }
}

// Camera controller component with responsive positioning
function CameraController({ cameraPosition }: { cameraPosition: CameraPosition }) {
  const { camera, gl } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const frameCount = useRef(0)
  const lastTime = useRef(0)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  // Responsive camera update function
  const updateResponsiveCamera = () => {
    const { fov, radius, height } = getResponsiveCameraParams()
    const mobile = isMobile()
    
    // Update camera FOV for mobile (only if it's a PerspectiveCamera)
    if ('fov' in camera) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    
    // Update renderer size
    gl.setSize(window.innerWidth, window.innerHeight)
    
    // Update camera aspect ratio (only if it's a PerspectiveCamera)
    if ('aspect' in camera) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 Responsive camera update: ${mobile ? 'Mobile' : 'Desktop'} | FOV: ${fov} | Radius: ${radius} | Height: ${height} | Size: ${window.innerWidth}x${window.innerHeight}`)
    }
  }

  // Initialize responsive camera and resize handling
  useEffect(() => {
    const updateCamera = () => {
      updateResponsiveCamera()
    }
    
    updateCamera()
    
    // Handle window resize
    const handleResize = () => {
      updateCamera()
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [camera, gl])

  useFrame((state) => {
    // Performance monitoring
    frameCount.current++
    if (state.clock.elapsedTime - lastTime.current >= 1) {
      const fps = frameCount.current / (state.clock.elapsedTime - lastTime.current)
      if (process.env.NODE_ENV === 'development' && fps < 50) {
        console.warn(`⚠️ Low FPS detected: ${fps.toFixed(1)} fps`)
      }
      frameCount.current = 0
      lastTime.current = state.clock.elapsedTime
    }
    
    // Get responsive parameters
    const { radius, height } = getResponsiveCameraParams()
    const mobile = isMobile()
    
    // Apply responsive scaling to camera position with enhanced mobile optimization
    const responsiveX = cameraPosition.x * (mobile ? radius / 40 : 1)
    const responsiveY = cameraPosition.y * (mobile ? height / 10 : 1)
    const responsiveZ = cameraPosition.z * (mobile ? radius / 40 : 1)
    
    // Enhanced smooth camera movement with responsive positioning
    targetPosition.current.set(responsiveX, responsiveY, responsiveZ)
    
    // Ensure camera stays within reasonable bounds for mobile
    if (mobile) {
      const maxDistance = radius * 1.2
      const distance = Math.sqrt(responsiveX ** 2 + responsiveY ** 2 + responsiveZ ** 2)
      if (distance > maxDistance) {
        const scale = maxDistance / distance
        targetPosition.current.multiplyScalar(scale)
      }
    }
    
    // Use lerp for smooth camera movement with better responsiveness
    camera.position.lerp(targetPosition.current, 0.12) // Optimized for smooth orbit
    
    // Always look at the watch center with enhanced focus
    targetLookAt.current.set(
      cameraPosition.lookAtX || 0,
      cameraPosition.lookAtY || 0,
      cameraPosition.lookAtZ || 0
    )
    
    // Enhanced camera lookAt with smooth interpolation
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    currentLookAt.add(camera.position)
    
    const newLookAt = targetLookAt.current.clone()
    currentLookAt.lerp(newLookAt, 0.08) // Optimized for responsive lookAt
    
    // Ensure camera always looks at the watch model center
    camera.lookAt(targetLookAt.current)
    
    // Update camera matrix to ensure changes take effect
    camera.updateMatrixWorld()
  })

  return null
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="text-white text-xl">Loading...</div>
    </Html>
  )
}

// Main scene component
interface WatchSceneProps {
  scrollProgress: number
  cameraPosition: CameraPosition
  activeFeature: FeatureSegment | null
}

export default function WatchScene({ scrollProgress, cameraPosition, activeFeature }: WatchSceneProps) {
  const { cameraParams, isMobileDevice } = useResponsiveCamera()
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [6, 2, 6], fov: cameraParams.fov }}
        gl={{ antialias: true, alpha: true }}
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }}
        style={{
          touchAction: 'none', // Disable default touch behaviors on mobile
          width: '100vw',
          height: '100vh'
        }}
        onCreated={({ gl, camera }) => {
          // Set initial responsive camera parameters
          if ('fov' in camera) {
            camera.fov = cameraParams.fov
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
          }
          gl.setSize(window.innerWidth, window.innerHeight)
        }}
      >
        <Suspense fallback={<Loader />}>
          {/* Camera Controller */}
          <CameraController cameraPosition={cameraPosition} />
          
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[8, 12, 8]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-8, 5, -8]} intensity={0.6} color="#D4AF37" />
          <pointLight position={[8, -5, 8]} intensity={0.4} color="#FFD700" />
          
          {/* Environment */}
          <Environment preset="city" background={false} />
          
          {/* Ground plane for shadows */}
          <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color="#0E0E0E" 
              transparent 
              opacity={0.1}
              roughness={0.8}
            />
          </mesh>
          
          {/* Smart Watch - Static at center */}
          <SmartWatchWrapper />
          
          {/* Enhanced Feature Markers */}
          <EnhancedFeatureMarkers 
            scrollProgress={scrollProgress} 
            activeFeature={activeFeature}
          />
          
          {/* CTA Button */}
          {/* <CTAButton scrollProgress={scrollProgress} /> */}
          
          {/* Controls - disabled for scroll-based interaction */}
          <OrbitControls 
            enabled={false}
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload the GLB (if it exists)
try {
  useGLTF.preload('/models/smartwatch.glb')
} catch (error) {
  // Silent fail if model doesn't exist
}