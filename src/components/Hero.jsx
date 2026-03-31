import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const roles = ['Frontend Developer', 'React Developer', 'UI/UX Thinker', 'Full Stack Builder']
const stats = [
  { value: '3+', label: 'Years Learning' },
  { value: '4+', label: 'Projects Built' },
  { value: '3+', label: 'Tech Stacks' },
]

function ThreeBackground({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.z = 6

    scene.add(new THREE.AmbientLight(0xffffff, 0.2))
    const pl1 = new THREE.PointLight(0x34d399, 2.5, 20)
    pl1.position.set(5, 5, 5)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0x6ee7b7, 1.2, 15)
    pl2.position.set(-5, -5, -2)
    scene.add(pl2)

    const wire = (geo, color, opacity) => new THREE.Mesh(geo,
      new THREE.MeshStandardMaterial({ color, wireframe: true, transparent: true, opacity }))

    // Keep shapes to sides/corners so center text is clear
    const torus = wire(new THREE.TorusGeometry(1.0, 0.28, 32, 100), 0x34d399, 0.16)
    torus.position.set(5, 1, -1)
    scene.add(torus)

    const ico = wire(new THREE.IcosahedronGeometry(0.75, 0), 0x6ee7b7, 0.12)
    ico.position.set(-5, -1, -1.5)
    scene.add(ico)

    const torus2 = wire(new THREE.TorusGeometry(0.4, 0.12, 16, 60), 0xa7f3d0, 0.14)
    torus2.position.set(4, -3, -0.5)
    scene.add(torus2)

    const octa = wire(new THREE.OctahedronGeometry(0.55), 0x34d399, 0.09)
    octa.position.set(-4, 3, -2)
    scene.add(octa)

    // Subtle large ring in background
    const ring = wire(new THREE.TorusGeometry(3.5, 0.015, 8, 120), 0x34d399, 0.04)
    ring.rotation.x = Math.PI / 2.8
    scene.add(ring)

    let fId
    const clock = new THREE.Clock()
    const animate = () => {
      fId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      torus.rotation.x = t * 0.14; torus.rotation.y = t * 0.18
      torus.position.y = 1 + Math.sin(t * 0.7) * 0.3
      ico.rotation.x = t * 0.09; ico.rotation.z = t * 0.13
      ico.position.y = -1 + Math.sin(t * 0.5 + 1) * 0.35
      torus2.rotation.y = t * 0.32
      torus2.position.y = -3 + Math.sin(t * 1.0 + 2) * 0.2
      octa.rotation.x = t * 0.18; octa.rotation.y = t * 0.22
      octa.position.y = 3 + Math.sin(t * 0.8 + 3) * 0.25
      ring.rotation.z = t * 0.04
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(fId); window.removeEventListener('resize', onResize); renderer.dispose() }
  }, [canvasRef])
  return null
}

export default function Hero() {
  const canvasRef = useRef(null)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '64px', // offset for fixed navbar
      }}
    >
      {/* 3D canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', zIndex: 0,
      }} />
      <ThreeBackground canvasRef={canvasRef} />

      {/* Subtle center glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Main layout */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center',
        gap: '52px', padding: '40px 60px',
        maxWidth: '1200px', margin: '0 auto', width: '100%',
      }}>

        {/* ── LEFT: Photo card ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ flexShrink: 0, position: 'relative' }}
        >
          {/* Rotating dashed border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '-18px', left: '-18px', right: '-18px', bottom: '-18px',
              borderRadius: '24px',
              border: '1.5px dashed rgba(52,211,153,0.3)',
              pointerEvents: 'none',
            }}
          />

          {/* Photo */}
          <div style={{
            width: '240px', height: '300px',
            borderRadius: '18px', overflow: 'hidden',
            border: '1px solid rgba(52,211,153,0.18)',
            background: 'rgba(52,211,153,0.06)',
            position: 'relative',
          }}>
            <img
              src="/roshan.jpg"
              alt="Roshan Kumar"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            {/* Fallback */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '64px', fontWeight: '800',
              fontFamily: 'Syne, sans-serif',
              color: 'rgba(52,211,153,0.25)', letterSpacing: '-0.04em',
            }}>RS</div>
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, rgba(52,211,153,0.1) 0%, rgba(0,0,0,0.35) 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Name + badge below photo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            style={{ marginTop: '14px', textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: '700',
              fontSize: '18px', color: 'white', marginBottom: '8px',
            }}>
              Roshan Singh
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.22)',
              borderRadius: '999px', padding: '5px 14px',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#34d399', animation: 'blink 2s infinite',
              }} />
              <span style={{
                fontSize: '11px', color: '#34d399',
                fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em',
              }}>
                Open to work
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Text ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* FRONTEND — solid white */}
          <div style={{ overflow: 'hidden', lineHeight: 1 }}>
            <motion.div
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '800',
                // clamp keeps it from overflowing
                fontSize: 'clamp(36px, 5.3vw, 72px)',
                color: 'white',
                letterSpacing: '-0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              FRONTEND
            </motion.div>
          </div>

          {/* DEVELOPER — outlined ghost text */}
          <div style={{ overflow: 'hidden', lineHeight: 1, marginBottom: '20px' }}>
            <motion.div
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '800',
                fontSize: 'clamp(36px, 4vw, 72px)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
                color: 'transparent',
                letterSpacing: '-0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              DEVELOPER
            </motion.div>
          </div>

          {/* Cycling role subtitle */}
          <div style={{
            height: '32px', overflow: 'hidden',
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '18px',
          }}>
            <div style={{ width: '28px', height: '1px', background: '#34d399', flexShrink: 0 }} />
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '13px', color: '#34d399',
                  fontFamily: 'Syne, sans-serif', fontWeight: '500',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              color: 'rgba(255,255,255,0.42)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.85', maxWidth: '440px',
              marginBottom: '32px',
            }}
          >
            Passionate about creating fast, intuitive, and beautiful web experiences.
            Specializing in transforming ideas into crafted digital products with React.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            style={{
              display: 'flex', gap: '40px',
              paddingBottom: '28px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              marginBottom: '28px',
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <div style={{
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: '800', fontFamily: 'Syne, sans-serif',
                  color: 'white', lineHeight: 1, marginBottom: '5px',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <motion.a
              href="#projects"
              onClick={e => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              whileHover={{ scale: 1.04, backgroundColor: '#34d399', color: '#0a0a0a' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '12px 26px', borderRadius: '999px',
                border: '1px solid #34d399', color: '#34d399',
                fontFamily: 'Syne, sans-serif', fontWeight: '600',
                fontSize: '13px', cursor: 'pointer',
                textDecoration: 'none', backgroundColor: 'transparent',
                letterSpacing: '0.04em',
              }}
            >
              View Projects →
            </motion.a>

            <motion.a
              href="#contact"
              onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '12px 26px', borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'Syne, sans-serif', fontWeight: '600',
                fontSize: '13px', cursor: 'pointer',
                textDecoration: 'none', backgroundColor: 'transparent',
                letterSpacing: '0.04em',
              }}
            >
              Contact Me
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        style={{
          position: 'absolute', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}
      >
        <span style={{
          fontSize: '10px', color: 'rgba(255,255,255,0.18)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, rgba(52,211,153,0.6), transparent)',
          }}
        />
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 768px) {
          #hero > div:last-child { flex-direction: column !important; padding: 24px 20px !important; gap: 32px !important; }
          #hero > div:last-child > div:first-child { align-self: center; }
        }
      `}</style>
    </section>
  )
}