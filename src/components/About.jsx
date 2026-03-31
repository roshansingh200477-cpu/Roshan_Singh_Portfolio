import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'

const facts = [
  { icon: '🎓', label: 'Education', value: 'BCA Final Year — IGNOU Delhi' },
  { icon: '📍', label: 'Location', value: 'Delhi, India' },
  { icon: '💼', label: 'Status', value: 'Seeking Internships & Roles' },
  { icon: '🚀', label: 'Focus', value: 'Frontend & Full Stack Dev' },
]

const traits = [
  'Clean Code', 'Fast UI', 'React', 'Problem Solver',
  'Node.js', 'MongoDB', 'Teamwork', 'FastAPI', 'Open Source',
]

function GlobeCanvas({ canvasRef, mouseRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.z = 4.5

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))
    const pl1 = new THREE.PointLight(0x34d399, 3, 20)
    pl1.position.set(3, 3, 3)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0x6ee7b7, 1.5, 15)
    pl2.position.set(-3, -3, -2)
    scene.add(pl2)
    const pl3 = new THREE.PointLight(0xffffff, 0.5, 10)
    pl3.position.set(0, 5, 2)
    scene.add(pl3)

    // Main globe — wireframe sphere
    const globeGeo = new THREE.SphereGeometry(1.4, 32, 32)
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const globe = new THREE.Mesh(globeGeo, globeMat)
    scene.add(globe)

    // Inner solid sphere with glow
    const innerGeo = new THREE.SphereGeometry(1.35, 64, 64)
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0a1a14,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.8,
    })
    const inner = new THREE.Mesh(innerGeo, innerMat)
    scene.add(inner)

    // Latitude rings
    const rings = []
    ;[0, 30, -30, 60, -60].forEach((lat, i) => {
      const rad = Math.cos((lat * Math.PI) / 180) * 1.42
      const y = Math.sin((lat * Math.PI) / 180) * 1.42
      const ringGeo = new THREE.TorusGeometry(rad, 0.008, 8, 120)
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: i === 0 ? 0.35 : 0.15,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.y = y
      ring.rotation.x = Math.PI / 2
      scene.add(ring)
      rings.push(ring)
    })

    // Longitude rings
    ;[0, 60, 120].forEach(lon => {
      const ringGeo = new THREE.TorusGeometry(1.42, 0.006, 8, 120)
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x6ee7b7,
        transparent: true,
        opacity: 0.1,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.y = (lon * Math.PI) / 180
      scene.add(ring)
    })

    // Floating dots on surface (like cities)
    const dotGroup = new THREE.Group()
    for (let i = 0; i < 40; i++) {
      const phi = Math.acos(-1 + (2 * i) / 40)
      const theta = Math.sqrt(40 * Math.PI) * phi
      const dotGeo = new THREE.SphereGeometry(0.018, 8, 8)
      const dotMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.7,
        emissive: 0x34d399,
        emissiveIntensity: 0.5,
      })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.setFromSphericalCoords(1.42,
        Math.acos(-1 + (2 * i) / 40),
        Math.sqrt(40 * Math.PI) * Math.acos(-1 + (2 * i) / 40)
      )
      dotGroup.add(dot)
    }
    scene.add(dotGroup)

    // Outer glow ring
    const glowGeo = new THREE.TorusGeometry(1.65, 0.04, 8, 120)
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x34d399, transparent: true, opacity: 0.06,
    })
    const glowRing = new THREE.Mesh(glowGeo, glowMat)
    glowRing.rotation.x = Math.PI / 2.5
    scene.add(glowRing)

    // Orbiting satellite dot
    const satGeo = new THREE.SphereGeometry(0.04, 8, 8)
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x34d399,
      emissiveIntensity: 1, transparent: true, opacity: 0.9,
    })
    const satellite = new THREE.Mesh(satGeo, satMat)
    scene.add(satellite)

    const groupRef = new THREE.Group()
    groupRef.add(globe)
    groupRef.add(inner)
    groupRef.add(dotGroup)
    scene.add(groupRef)

    let fId
    const clock = new THREE.Clock()

    const animate = () => {
      fId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Auto rotate
      groupRef.rotation.y = t * 0.18

      // Mouse parallax
      if (mouseRef.current) {
        const { x, y } = mouseRef.current
        groupRef.rotation.x += (y * 0.3 - groupRef.rotation.x) * 0.05
        glowRing.rotation.y += (x * 0.2 - glowRing.rotation.y) * 0.03
      }

      // Orbiting satellite
      satellite.position.x = Math.cos(t * 0.6) * 1.9
      satellite.position.y = Math.sin(t * 0.4) * 0.8
      satellite.position.z = Math.sin(t * 0.6) * 1.9

      // Pulse glow ring
      glowRing.material.opacity = 0.04 + Math.sin(t * 1.2) * 0.03
      glowRing.rotation.z = t * 0.05

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
    return () => {
      cancelAnimationFrame(fId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [canvasRef, mouseRef])

  return null
}

export default function About() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '80px 0',
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)',
      }} />

      {/* Faint grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(52,211,153,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(52,211,153,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 60px', width: '100%',
        display: 'flex', alignItems: 'center',
        gap: '60px',
      }}>

        {/* ── LEFT: 3D Globe ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flexShrink: 0, position: 'relative',
            width: '420px', height: '420px',
          }}
        >
          {/* Glow behind globe */}
          <div style={{
            position: 'absolute', inset: '10%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          <GlobeCanvas canvasRef={canvasRef} mouseRef={mouseRef} />

          {/* Floating label chips around globe */}
          {[
            { label: 'React', top: '8%', left: '60%' },
            { label: 'Node.js', top: '30%', left: '-8%' },
            { label: 'MongoDB', top: '70%', left: '65%' },
            { label: 'FastAPI', top: '80%', left: '5%' },
          ].map((chip, i) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: chip.top, left: chip.left,
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'rgba(10,26,20,0.9)',
                border: '1px solid rgba(52,211,153,0.25)',
                fontSize: '11px', fontFamily: 'Syne, sans-serif',
                color: '#34d399', fontWeight: '600',
                letterSpacing: '0.05em',
                backdropFilter: 'blur(8px)',
                animation: `float${i} ${3 + i * 0.5}s ease-in-out infinite`,
                whiteSpace: 'nowrap',
              }}
            >
              {chip.label}
            </motion.div>
          ))}
        </motion.div>

        {/* ── RIGHT: Text content ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ flex: 1, minWidth: 0 }}
        >
          {/* Section label */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ width: '24px', height: '1px', background: '#34d399' }} />
            <span style={{
              fontSize: '11px', color: '#34d399',
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              About Me
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: '800',
              fontSize: 'clamp(32px, 4vw, 52px)',
              color: 'white', letterSpacing: '-0.03em',
              lineHeight: 1.1, marginBottom: '20px',
            }}
          >
            Building things that<br />
            <span style={{ color: '#34d399' }}>live on the internet</span>
          </motion.h2>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.42)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.9',
              marginBottom: '32px',
              maxWidth: '460px',
            }}
          >
            I'm a final-year BCA student at IGNOU Delhi with a passion for
            building full-stack web applications that are fast, beautiful, and
            functional. From fake news detection systems to SaaS dashboards —
            I love turning complex problems into clean digital products.
          </motion.p>

          {/* Fact cards grid */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px', marginBottom: '32px',
            }}
          >
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, borderColor: 'rgba(52,211,153,0.35)' }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'default',
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '6px' }}>{fact.icon}</div>
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginBottom: '3px',
                }}>
                  {fact.label}
                </div>
                <div style={{
                  fontSize: '13px', color: 'rgba(255,255,255,0.75)',
                  fontFamily: 'Syne, sans-serif', fontWeight: '500',
                }}>
                  {fact.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trait tags */}
          <motion.div
            variants={itemVariants}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          >
            {traits.map((trait, i) => (
              <motion.span
                key={trait}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.0 + i * 0.07 }}
                whileHover={{
                  scale: 1.08,
                  backgroundColor: 'rgba(52,211,153,0.12)',
                  borderColor: 'rgba(52,211,153,0.4)',
                  color: '#34d399',
                }}
                style={{
                  padding: '5px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.03em',
                  cursor: 'default',
                  transition: 'all 0.2s ease',
                }}
              >
                {trait}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @media (max-width: 900px) {
          #about > div > div {
            flex-direction: column !important;
            align-items: center !important;
          }
          #about > div > div > div:first-child {
            width: 300px !important;
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  )
}