import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function Particles() {
  const ref = useRef<THREE.Points>(null)
  const particleCount = 1000

  // Generate particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spread particles across the viewport
      positions[i] = (Math.random() - 0.5) * 4 // X
      positions[i + 1] = (Math.random() - 0.5) * 4 // Y
      positions[i + 2] = (Math.random() - 0.5) * 2 // Z
    }

    return positions
  }, [particleCount])

  // Animate particles
  useFrame(({ clock }) => {
    if (!ref.current) return

    const positions = ref.current.geometry.attributes.position.array as Float32Array
    const elapsed = clock.getElapsedTime()

    for (let i = 0; i < particleCount; i++) {
      const posY = positions[i * 3 + 1]
      const posX = positions[i * 3]
      const posZ = positions[i * 3 + 2]

      // Float upward slowly
      const newY = (posY + 0.0008) % 2.5
      positions[i * 3 + 1] = newY - 2.5

      // Subtle horizontal drift
      positions[i * 3] = posX + Math.sin(elapsed * 0.5 + i) * 0.0005

      // Subtle Z drift for depth
      positions[i * 3 + 2] = posZ + Math.cos(elapsed * 0.3 + i) * 0.0003
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#C5A258"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}
