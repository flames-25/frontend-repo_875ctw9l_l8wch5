import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, Sky, Stars } from '@react-three/drei'

function useKeys() {
  const [keys, set] = useState({ forward: false, back: false, left: false, right: false, brake: false })
  useEffect(() => {
    const down = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') set((k) => ({ ...k, forward: true }))
      if (e.code === 'KeyS' || e.code === 'ArrowDown') set((k) => ({ ...k, back: true }))
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') set((k) => ({ ...k, left: true }))
      if (e.code === 'KeyD' || e.code === 'ArrowRight') set((k) => ({ ...k, right: true }))
      if (e.code === 'Space') set((k) => ({ ...k, brake: true }))
    }
    const up = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') set((k) => ({ ...k, forward: false }))
      if (e.code === 'KeyS' || e.code === 'ArrowDown') set((k) => ({ ...k, back: false }))
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') set((k) => ({ ...k, left: false }))
      if (e.code === 'KeyD' || e.code === 'ArrowRight') set((k) => ({ ...k, right: false }))
      if (e.code === 'Space') set((k) => ({ ...k, brake: false }))
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])
  return keys
}

function Car({ color = '#e5e7eb' }) {
  const ref = useRef()
  const keys = useKeys()
  const velocity = useRef(0)
  const heading = useRef(0) // radians
  const pos = useRef([0, 0.3, 0])

  useFrame((state, dt) => {
    const accel = 14 // m/s^2 scaled
    const maxSpeed = 60
    const friction = 2.0
    const brakeForce = 18
    const steer = 1.8 // rad/s steering rate

    // acceleration/brake
    if (keys.forward) velocity.current += accel * dt
    if (keys.back) velocity.current -= accel * 0.7 * dt
    if (keys.brake) velocity.current -= brakeForce * dt

    // clamp speed
    velocity.current = Math.max(-maxSpeed * 0.35, Math.min(maxSpeed, velocity.current))

    // friction
    if (!keys.forward && !keys.back) {
      const sign = Math.sign(velocity.current)
      const mag = Math.max(0, Math.abs(velocity.current) - friction * dt)
      velocity.current = mag * sign
    }

    // steering scales with speed
    const steerScale = Math.min(1, Math.abs(velocity.current) / 30)
    if (keys.left) heading.current += steer * steerScale * dt
    if (keys.right) heading.current -= steer * steerScale * dt

    // integrate
    const dx = Math.sin(heading.current) * velocity.current * dt
    const dz = Math.cos(heading.current) * velocity.current * dt
    pos.current = [pos.current[0] + dx, 0.3, pos.current[2] + dz]

    // apply to mesh
    if (ref.current) {
      ref.current.position.set(pos.current[0], pos.current[1], pos.current[2])
      ref.current.rotation.y = heading.current
    }

    // third-person camera follow
    const camOffset = [Math.sin(heading.current) * -6, 3, Math.cos(heading.current) * -6]
    const target = [pos.current[0], 0.6, pos.current[2]]
    const camPos = [target[0] + camOffset[0], target[1] + camOffset[1], target[2] + camOffset[2]]
    state.camera.position.lerp({ x: camPos[0], y: camPos[1], z: camPos[2] }, 1 - Math.pow(0.001, dt))
    state.camera.lookAt(target[0], target[1], target[2])
  })

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[1.9, 0.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.5, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.6, 2.2]} />
        <meshStandardMaterial color={'#111'} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Wheels */}
      {[-0.8, 0.8].map((x) => [
        <mesh key={`wf-${x}`} position={[x, -0.1, -1.3]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.35, 24]} />
          <meshStandardMaterial color={'#151515'} />
        </mesh>,
        <mesh key={`wr-${x}`} position={[x, -0.1, 1.3]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.35, 24]} />
          <meshStandardMaterial color={'#151515'} />
        </mesh>
      ])}
      {/* Headlights */}
      <spotLight position={[0.7, 0.4, -2.2]} angle={0.5} intensity={2} distance={20} color={'#aaf2ff'} />
      <spotLight position={[-0.7, 0.4, -2.2]} angle={0.5} intensity={2} distance={20} color={'#aaf2ff'} />
    </group>
  )
}

function City() {
  // Generate some simple buildings and props for a sense of world scale
  const buildings = useMemo(() => {
    const arr = []
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 600
      const z = (Math.random() - 0.5) * 600
      const h = 3 + Math.random() * 18
      arr.push({ x, z, h, w: 5 + Math.random() * 10, d: 5 + Math.random() * 10 })
    }
    return arr
  }, [])

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} receiveShadow castShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color={i % 2 ? '#111418' : '#0d0f12'} metalness={0.2} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#1b1f27" roughness={1} metalness={0} />
    </mesh>
  )
}

function TrackProps() {
  // Add some trackside lights and arches
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2
      arr.push({ x: Math.sin(angle) * 120, z: Math.cos(angle) * 120 })
    }
    return arr
  }, [])

  return (
    <group>
      {items.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, 2, 0]}>
            <torusGeometry args={[2.2, 0.15, 16, 48]} />
            <meshStandardMaterial color={'#4f46e5'} metalness={0.8} roughness={0.2} emissive={'#1d1b5e'} emissiveIntensity={0.4} />
          </mesh>
          <pointLight position={[0, 3, 0]} intensity={1.2} color={'#60a5fa'} distance={25} />
        </group>
      ))}
    </group>
  )
}

function HUD() {
  const [speed, setSpeed] = useState(0)
  // Tap into a custom event dispatched by Car to show speed (optional future hook)
  useEffect(() => {
    const onSpeed = (e) => setSpeed(e.detail || 0)
    window.addEventListener('car-speed', onSpeed)
    return () => window.removeEventListener('car-speed', onSpeed)
  }, [])

  return (
    <Html fullscreen>
      <div className="pointer-events-none select-none absolute inset-0 p-6 flex flex-col">
        <div className="mt-auto w-full flex items-end justify-between text-white">
          <div className="backdrop-blur bg-black/40 rounded-xl p-4 border border-white/10">
            <p className="text-xs uppercase tracking-widest text-white/60">Mode</p>
            <p className="text-lg font-semibold">Open World</p>
          </div>
          <div className="text-right backdrop-blur bg-black/40 rounded-xl p-4 border border-white/10">
            <p className="text-xs uppercase tracking-widest text-white/60">Speed</p>
            <p className="text-3xl font-bold tabular-nums">{Math.round(speed)}</p>
          </div>
        </div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/80 backdrop-blur bg-black/40 rounded-full px-4 py-2 border border-white/10">
          WASD / Arrow keys to drive • Space to brake • Explore the world
        </div>
      </div>
    </Html>
  )
}

export default function Play() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas shadows camera={{ position: [0, 6, 10], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={[0, 0, 0]} />
        <fog attach="fog" args={[0x000000, 40, 600]} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[30, 50, 10]}
          intensity={1.3}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={2} mieCoefficient={0.02} mieDirectionalG={0.9} inclination={0.5} />
        <Stars radius={200} depth={60} count={8000} factor={4} fade speed={0.5} />

        {/* World */}
        <Ground />
        <City />
        <TrackProps />
        <Car color={'#e11d48'} />

        <Environment preset="city" />
        <HUD />
      </Canvas>
    </div>
  )
}
