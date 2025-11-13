import React from 'react'
import Spline from '@splinetool/react-spline'

function App() {
  const handlePlayDemo = () => {
    window.location.href = '/play'
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-fuchsia-500" />
            <span className="text-lg font-semibold tracking-wider">Apex Drive</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-white/80">
            <a href="#cars" className="hover:text-white transition-colors">Cars</a>
            <a href="#world" className="hover:text-white transition-colors">Open World</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#media" className="hover:text-white transition-colors">Media</a>
          </nav>
          <button onClick={handlePlayDemo} className="inline-flex items-center gap-2 rounded-md bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
            Play Demo
          </button>
        </div>
      </header>

      {/* Hero with Spline */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Gradient overlays should not block interaction with Spline */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black" />

        <div className="relative z-10 h-full flex items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.25em] text-white/80 mb-3">Next‑Gen Racing</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
                Hyper‑real racing with the world’s most expensive cars
              </h1>
              <p className="mt-4 text-white/80 text-base sm:text-lg">
                Feel the roar of V12s, master razor‑sharp handling, and explore a massive open world. Built for speed, crafted for realism.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={handlePlayDemo} className="rounded-md bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">
                  Play Demo
                </button>
                <a href="#features" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors">
                  Learn more
                </a>
              </div>
              <div className="mt-6 flex items-center gap-6 text-xs text-white/60">
                <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />Real‑time reflections</div>
                <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-sky-400" />Dynamic day & night</div>
                <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-fuchsia-400" />High‑fidelity audio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase: Expensive Cars */}
      <section id="cars" className="relative py-20 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Drive the legends</h2>
          <p className="text-white/70 max-w-2xl mb-10">
            Meticulously modeled hypercars with bespoke interiors and track‑accurate performance. Unlock, tune, and dominate.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bugatti Chiron Super Sport', top: '273 mph', price: '$3.9M', img: 'https://images.unsplash.com/photo-1606664328445-6eac33fdc7c7?q=80&w=1600&auto=format&fit=crop' },
              { name: 'Lamborghini Aventador SVJ', top: '217 mph', price: '$517K', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=1600&auto=format&fit=crop' },
              { name: 'Ferrari LaFerrari', top: '217 mph', price: '$1.5M', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop' },
              { name: 'Koenigsegg Jesko', top: '300+ mph', price: '$3.0M', img: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop' },
              { name: 'Pagani Huayra', top: '238 mph', price: '$2.6M', img: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop' },
              { name: 'McLaren P1', top: '217 mph', price: '$1.15M', img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1600&auto=format&fit=crop' },
              { name: 'Aston Martin Valkyrie', top: '250 mph', price: '$3.0M', img: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee4b2?q=80&w=1600&auto=format&fit=crop' },
              { name: 'Rimac Nevera', top: '258 mph', price: '$2.4M', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop' },
            ].map((car) => (
              <div key={car.name} className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10">
                <div className="aspect-video overflow-hidden">
                  <img src={car.img} alt={car.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{car.name}</h3>
                  <p className="text-white/60 text-sm">Top speed: {car.top}</p>
                  <p className="text-white/60 text-sm">Base price: {car.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open World */}
      <section id="world" className="relative py-20 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">A massive open world</h2>
            <p className="text-white/70 mb-6">
              Cruise through canyons, coastal highways, neon‑lit downtowns, and winding alpine passes across a 120 km² map. Seamless exploration with zero loading screens.
            </p>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" /> Dynamic traffic & events
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-400" /> Live seasons & weather
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-fuchsia-400" /> Secrets, jumps, and speed traps
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              <a href="#features" className="rounded-md bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">Explore Features</a>
              <a href="#media" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors">Watch Clips</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" alt="Open world map" className="h-full w-full object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 bg-gradient-to-b from-[#0A0A0A] to-black">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">Built for realism and speed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Physics you can feel', desc: 'Tire deformation, aero load, and drivetrain simulation for authentic handling.' },
              { title: 'Deep customization', desc: 'Aero kits, liveries, rims, and pro‑tuned setups. Share and download tunes.' },
              { title: 'Multiplayer', desc: 'Cruise the open world, drift meets, seasonal events and ranked sprints.' },
              { title: 'Photo & Replay', desc: 'Cinematic camera tools with motion blur, DOF, and ray‑traced reflections.' },
              { title: 'Sound design', desc: 'Hand‑recorded exhausts, transmission whine, and cabin acoustics.' },
              { title: 'Controller & Wheel', desc: 'Full wheel support with FFB profiles. 120 FPS+ on supported hardware.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-white/70 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media/Gallery */}
      <section id="media" className="relative py-20 bg-black">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">In‑engine glimpses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=1600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1600&auto=format&fit=crop',
            ].map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border border-white/10">
                <img src={src} alt="Racing still" className="h-full w-full object-cover aspect-video hover:scale-[1.02] transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-gradient-to-b from-black to-[#050505]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold">Ready to hit the apex?</h3>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Get early access, seasonal rewards, and exclusive hypercar drops.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={handlePlayDemo} className="rounded-md bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">
              Play Demo
            </button>
            <a href="#" className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors">
              Join Waitlist
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Apex Drive. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#world" className="hover:text-white">Open World</a>
            <a href="#cars" className="hover:text-white">Cars</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
