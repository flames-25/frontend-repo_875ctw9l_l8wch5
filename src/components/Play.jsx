import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, Sky, Stars } from '@react-three/drei'

function useKeys(enabled = true) {
  const [keys, set] = useState({ forward: false, back: false, left: false, right: false, brake: false })
  useEffect(() => {
    const down = (e) => {
      if (!enabled) return
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
  }, [enabled])
  return keys
}

function Car({ color = '#e5e7eb', enabled = true, accel = 14, maxSpeed = 60, brakeForce = 18, steerRate = 1.8 }) {
  const ref = useRef()
  const keys = useKeys(enabled)
  const velocity = useRef(0)
  const heading = useRef(0) // radians
  const pos = useRef([0, 0.3, 0])

  useFrame((state, dt) => {
    const friction = 2.0

    // acceleration/brake
    if (enabled) {
      if (keys.forward) velocity.current += accel * dt
      if (keys.back) velocity.current -= accel * 0.7 * dt
      if (keys.brake) velocity.current -= brakeForce * dt
    }

    // clamp speed
    velocity.current = Math.max(-maxSpeed * 0.35, Math.min(maxSpeed, velocity.current))

    // friction
    if (!enabled || (!keys.forward && !keys.back)) {
      const sign = Math.sign(velocity.current)
      const mag = Math.max(0, Math.abs(velocity.current) - friction * dt)
      velocity.current = mag * sign
    }

    // steering scales with speed
    const steerScale = Math.min(1, Math.abs(velocity.current) / 30)
    if (enabled) {
      if (keys.left) heading.current += steerRate * steerScale * dt
      if (keys.right) heading.current -= steerRate * steerScale * dt
    }

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

    // dispatch speed (rough scale to km/h)
    const speedKmh = Math.max(0, Math.abs(velocity.current) * 7.5)
    window.dispatchEvent(new CustomEvent('car-speed', { detail: speedKmh }))
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

function HUD({ carName, showGarageHint }) {
  const [speed, setSpeed] = useState(0)
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
            <p className="text-xs text-white/60 mt-1">{carName}</p>
          </div>
          <div className="text-right backdrop-blur bg-black/40 rounded-xl p-4 border border-white/10">
            <p className="text-xs uppercase tracking-widest text-white/60">Speed</p>
            <p className="text-3xl font-bold tabular-nums">{Math.round(speed)} km/h</p>
          </div>
        </div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/80 backdrop-blur bg-black/40 rounded-full px-4 py-2 border border-white/10">
          WASD / Arrow keys to drive • Space to brake{showGarageHint ? ' • Press G for Garage' : ''}
        </div>
      </div>
    </Html>
  )
}

function CarSelector({ cars, selectedIndex, setSelectedIndex, onStart }) {
  return (
    <Html fullscreen>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="pointer-events-auto max-w-5xl w-full rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl text-white shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
              <h3 className="text-xl font-bold">Choose your hypercar</h3>
              <p className="text-white/70 text-sm mt-1">Each car features authentic performance and handling characteristics.</p>
              <div className="grid grid-cols-2 gap-3 mt-5 max-h-72 overflow-auto pr-1">
                {cars.map((c, i) => (
                  <button key={c.name} onClick={() => setSelectedIndex(i)} className={`text-left rounded-xl border transition-colors ${selectedIndex === i ? 'border-white/40 bg-white/10' : 'border-white/10 hover:bg-white/5'} p-3`}>
                    <div className="text-sm font-semibold leading-tight">{c.name}</div>
                    <div className="text-xs text-white/60 mt-1">{c.top} • {c.power} • {c.drive}</div>
                    <div className="mt-2 h-1.5 rounded-full" style={{ background: c.color }} />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-white/10">
              {(() => {
                const c = cars[selectedIndex]
                return (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{c.name}</h4>
                      <span className="text-sm text-white/60">{c.price}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="text-white/60 text-xs">Top speed</div>
                        <div className="font-semibold">{c.top}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="text-white/60 text-xs">0–60 mph</div>
                        <div className="font-semibold">{c.zeroToSixty}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="text-white/60 text-xs">Power</div>
                        <div className="font-semibold">{c.power}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="text-white/60 text-xs">Drivetrain</div>
                        <div className="font-semibold">{c.drive}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="text-white/60 text-xs">Weight</div>
                        <div className="font-semibold">{c.weight}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="text-white/60 text-xs">Transmission</div>
                        <div className="font-semibold">{c.trans}</div>
                      </div>
                    </div>
                    <button onClick={onStart} className="mt-6 w-full rounded-lg bg-white text-black py-3 font-semibold hover:bg-white/90 transition-colors">Start Driving</button>
                    <p className="mt-2 text-center text-xs text-white/60">Press G anytime to return to Garage</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </Html>
  )
}

export default function Play() {
  const cars = [
    { name: 'Bugatti Chiron Super Sport', top: '273 mph', price: '$3.9M', power: '1577 hp', zeroToSixty: '2.3 s', drive: 'AWD', weight: '1995 kg', trans: '7‑spd DCT', color: '#0ea5e9', perf: { accel: 18, maxSpeed: 95, brake: 20, steer: 1.6 } },
    { name: 'Koenigsegg Jesko', top: '300+ mph', price: '$3.0M', power: '1600 hp', zeroToSixty: '2.5 s', drive: 'RWD', weight: '1420 kg', trans: '9‑spd LST', color: '#22c55e', perf: { accel: 19, maxSpeed: 100, brake: 19, steer: 1.7 } },
    { name: 'Ferrari LaFerrari', top: '217 mph', price: '$1.5M', power: '950 hp', zeroToSixty: '2.6 s', drive: 'RWD', weight: '1255 kg', trans: '7‑spd DCT', color: '#ef4444', perf: { accel: 15, maxSpeed: 75, brake: 18, steer: 1.9 } },
    { name: 'Lamborghini Aventador SVJ', top: '217 mph', price: '$517K', power: '759 hp', zeroToSixty: '2.8 s', drive: 'AWD', weight: '1525 kg', trans: '7‑spd ISR', color: '#fde047', perf: { accel: 14, maxSpeed: 72, brake: 17, steer: 1.7 } },
    { name: 'Pagani Huayra', top: '238 mph', price: '$2.6M', power: '791 hp', zeroToSixty: '3.0 s', drive: 'RWD', weight: '1350 kg', trans: '7‑spd AMT', color: '#a78bfa', perf: { accel: 13.5, maxSpeed: 78, brake: 17, steer: 1.8 } },
    { name: 'McLaren P1', top: '217 mph', price: '$1.15M', power: '903 hp', zeroToSixty: '2.8 s', drive: 'RWD', weight: '1490 kg', trans: '7‑spd DCT', color: '#fb923c', perf: { accel: 16, maxSpeed: 80, brake: 19, steer: 2.0 } },
    { name: 'Aston Martin Valkyrie', top: '250 mph', price: '$3.0M', power: '1160 hp', zeroToSixty: '2.5 s', drive: 'RWD', weight: '1030 kg', trans: '7‑spd AMT', color: '#34d399', perf: { accel: 17, maxSpeed: 85, brake: 19, steer: 2.1 } },
    { name: 'Rimac Nevera', top: '258 mph', price: '$2.4M', power: '1914 hp', zeroToSixty: '1.85 s', drive: 'AWD', weight: '2150 kg', trans: '1‑spd', color: '#38bdf8', perf: { accel: 22, maxSpeed: 90, brake: 21, steer: 1.6 } }
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [garageOpen, setGarageOpen] = useState(true)

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyG') setGarageOpen((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const current = cars[selectedIndex]

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
        <Car
          color={current.color}
          enabled={!garageOpen}
          accel={current.perf.accel}
          maxSpeed={current.perf.maxSpeed}
          brakeForce={current.perf.brake}
          steerRate={current.perf.steer}
        />

        <Environment preset="city" />
        <HUD carName={current.name} showGarageHint={!garageOpen} />
        {garageOpen && (
          <CarSelector
            cars={cars}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onStart={() => setGarageOpen(false)}
          />
        )}
      </Canvas>
    </div>
  )
}
