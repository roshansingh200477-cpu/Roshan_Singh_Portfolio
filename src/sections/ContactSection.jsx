import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import emailjs from '@emailjs/browser'

const socials = [
  {
    label: 'GitHub',
    handle: 'Roshan Singh',
    href: 'https://github.com/roshansingh200477-cpu',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'Roshan Singh',
    href: 'https://www.linkedin.com/in/roshan-singh-80850b364/',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    handle: 'Roshan Singh',
    href: 'mailto:roshansingh200477@gmail.com',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

// ── 3D DNA / helix background ────────────────────────────────
function ContactBg({ canvasRef, mouseRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200)
    camera.position.z = 22

    scene.add(new THREE.AmbientLight(0xffffff, 0.1))
    const pl1 = new THREE.PointLight(0x34d399, 2.5, 60)
    pl1.position.set(8, 8, 8)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0x6ee7b7, 1.2, 40)
    pl2.position.set(-8, -8, -4)
    scene.add(pl2)

    // Helix strand
    const helixGroup = new THREE.Group()
    const strandCount = 60
    const strand1Dots = [], strand2Dots = [], connectors = []

    for (let i = 0; i < strandCount; i++) {
      const t = (i / strandCount) * Math.PI * 6
      const r = 3.5

      const x1 = Math.cos(t) * r
      const x2 = Math.cos(t + Math.PI) * r
      const y = (i / strandCount) * 28 - 14
      const z1 = Math.sin(t) * r
      const z2 = Math.sin(t + Math.PI) * r

      // Strand 1 dot
      const d1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({
          color: 0x34d399, emissive: 0x34d399,
          emissiveIntensity: 0.4, transparent: true, opacity: 0.8,
        })
      )
      d1.position.set(x1, y, z1)
      helixGroup.add(d1)
      strand1Dots.push(d1)

      // Strand 2 dot
      const d2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({
          color: 0x6ee7b7, emissive: 0x6ee7b7,
          emissiveIntensity: 0.3, transparent: true, opacity: 0.7,
        })
      )
      d2.position.set(x2, y, z2)
      helixGroup.add(d2)
      strand2Dots.push(d2)

      // Connector every 5 steps
      if (i % 5 === 0) {
        const mid = new THREE.Vector3(
          (x1 + x2) / 2, y, (z1 + z2) / 2
        )
        const len = new THREE.Vector3(x1, y, z1)
          .distanceTo(new THREE.Vector3(x2, y, z2))
        const connGeo = new THREE.CylinderGeometry(0.015, 0.015, len, 6)
        const connMat = new THREE.MeshStandardMaterial({
          color: 0x34d399, transparent: true, opacity: 0.2,
        })
        const conn = new THREE.Mesh(connGeo, connMat)
        conn.position.copy(mid)
        conn.lookAt(new THREE.Vector3(x1, y, z1))
        conn.rotateX(Math.PI / 2)
        helixGroup.add(conn)
        connectors.push(conn)
      }
    }

    helixGroup.position.x = 10
    scene.add(helixGroup)

    // Particles
    const pCount = 180
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 60
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x34d399, size: 0.14,
      transparent: true, opacity: 0.22,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Torus on the left
    const torusGeo = new THREE.TorusGeometry(3, 0.015, 8, 120)
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x34d399, transparent: true, opacity: 0.07,
    })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(-8, 0, -5)
    torus.rotation.x = Math.PI / 4
    scene.add(torus)

    let fId
    const clock = new THREE.Clock()
    const animate = () => {
      fId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      helixGroup.rotation.y = t * 0.25
      particles.rotation.y = t * 0.012
      torus.rotation.z = t * 0.04
      torus.rotation.y = t * 0.02

      if (mouseRef.current) {
        helixGroup.rotation.x += (mouseRef.current.y * 0.0003 - helixGroup.rotation.x * 0.01)
        particles.rotation.x += mouseRef.current.y * 0.00008
      }

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

// ── Input field component ─────────────────────────────────────
function Field({ label, name, type = 'text', multiline = false, value, onChange }) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0

  return (
    <div style={{ position: 'relative' }}>
      <motion.label
        animate={{
          top: focused || filled ? '-10px' : multiline ? '16px' : '50%',
          fontSize: focused || filled ? '10px' : '13px',
          color: focused ? '#34d399' : 'rgba(255,255,255,0.3)',
          y: focused || filled ? 0 : '-50%',
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute', left: '16px',
          pointerEvents: 'none', zIndex: 2,
          fontFamily: 'Syne, sans-serif',
          fontWeight: '500', letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: focused || filled ? '#0a0a0a' : 'transparent',
          padding: '0 4px',
          transformOrigin: 'left center',
        }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          style={{
            width: '100%', padding: '16px',
            borderRadius: '12px', resize: 'none',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${focused ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: 'white', fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.3s ease',
            boxShadow: focused ? '0 0 0 3px rgba(52,211,153,0.06)' : 'none',
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${focused ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: 'white', fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.3s ease',
            boxShadow: focused ? '0 0 0 3px rgba(52,211,153,0.06)' : 'none',
          }}
        />
      )}
    </div>
  )
}

// ── Main Section ──────────────────────────────────────────────
export default function ContactSection() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [form, setForm] = useState({ from_name: '', reply_to: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.from_name || !form.reply_to || !form.message) return
    setStatus('sending')

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.from_name,
          reply_to: form.reply_to,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      setStatus('success')
      setForm({ from_name: '', reply_to: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const btnLabel = {
    idle: 'Send Message →',
    sending: 'Sending...',
    success: '✓ Message Sent!',
    error: '✗ Failed. Try again.',
  }
  const btnColor = {
    idle: '#34d399',
    sending: 'rgba(52,211,153,0.5)',
    success: '#34d399',
    error: '#f87171',
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#080808',
        overflow: 'hidden',
        padding: '100px 0 80px',
      }}
    >
      {/* Top divider */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.35), transparent)',
      }} />

      {/* 3D canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', zIndex: 0,
      }} />
      <ContactBg canvasRef={canvasRef} mouseRef={mouseRef} />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(8,8,8,0.65) 20%, rgba(8,8,8,0.96) 80%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '1100px', margin: '0 auto', padding: '0 60px',
        display: 'flex', gap: '80px', alignItems: 'flex-start',
      }}>

        {/* ── LEFT: Info ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: '0 0 360px' }}
        >
          {/* Label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{ width: '24px', height: '1px', background: '#34d399' }} />
            <span style={{
              fontSize: '11px', color: '#34d399',
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Get In Touch
            </span>
          </div>

          {/* Heading */}
          <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: 'clamp(32px, 4vw, 52px)',
                color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1,
              }}
            >
              Let's work
            </motion.h2>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: 'clamp(32px, 4vw, 52px)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.2)',
                color: 'transparent',
                letterSpacing: '-0.03em', lineHeight: 1.1,
              }}
            >
              together
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontSize: '14px', color: 'rgba(255,255,255,0.38)',
              fontFamily: 'Inter, sans-serif', lineHeight: '1.9',
              marginBottom: '40px', maxWidth: '300px',
            }}
          >
            I'm currently open to internships, entry-level roles, and freelance
            projects. If you have an opportunity or just want to say hi — my inbox
            is always open.
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ x: 6, borderColor: 'rgba(52,211,153,0.35)' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#34d399', flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '13px', fontFamily: 'Syne, sans-serif',
                    fontWeight: '600', color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2px',
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontSize: '11px', fontFamily: 'Inter, sans-serif',
                    color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em',
                  }}>
                    {s.handle}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto', color: 'rgba(52,211,153,0.4)',
                  fontSize: '16px',
                }}>
                  ↗
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1 }}
        >
          <div style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Card inner glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)',
            }} />
            <div style={{
              position: 'absolute', top: '-80px', right: '-80px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(52,211,153,0.06), transparent 70%)',
              pointerEvents: 'none',
            }} />

            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: '700',
              fontSize: '20px', color: 'white',
              marginBottom: '8px', letterSpacing: '-0.02em',
            }}>
              Send a message
            </h3>
            <p style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.3)',
              fontFamily: 'Inter, sans-serif', marginBottom: '32px',
            }}>
              I usually reply within 24 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field
                  label="Your Name"
                  name="from_name"
                  value={form.from_name}
                  onChange={handleChange}
                />
                <Field
                  label="Your Email"
                  name="reply_to"
                  type="email"
                  value={form.reply_to}
                  onChange={handleChange}
                />
              </div>

              <Field
                label="Message"
                name="message"
                multiline
                value={form.message}
                onChange={handleChange}
              />

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={status === 'idle' ? { scale: 1.02 } : {}}
                whileTap={status === 'idle' ? { scale: 0.97 } : {}}
                animate={{
                  backgroundColor: status === 'success'
                    ? 'rgba(52,211,153,0.15)'
                    : status === 'error'
                    ? 'rgba(248,113,113,0.1)'
                    : 'transparent',
                }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: `1px solid ${btnColor[status]}`,
                  color: btnColor[status],
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: '700', fontSize: '14px',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.05em',
                  background: 'transparent',
                  transition: 'border-color 0.3s ease, color 0.3s ease',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Shimmer on idle */}
                {status === 'idle' && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                    style={{
                      position: 'absolute', top: 0, bottom: 0,
                      width: '30%', background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.12), transparent)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <AnimatePresence mode="wait">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    {btnLabel[status]}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* ── Footer strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.8 }}
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1100px', margin: '60px auto 0',
          padding: '24px 60px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}
      >
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: '700',
          fontSize: '18px', color: 'white', letterSpacing: '-0.02em',
        }}>
          Roshan Singh<span style={{ color: '#34d399' }}>.</span>
        </span>
        <span style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.2)',
          fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em',
        }}>
          © 2025 Roshan Singh · Built with React + Vite
        </span>
        <motion.a
          href="#hero"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          whileHover={{ scale: 1.08, color: '#34d399' }}
          style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.25)',
            fontFamily: 'Syne, sans-serif', textDecoration: 'none',
            letterSpacing: '0.05em', transition: 'color 0.2s ease',
          }}
        >
          Back to top ↑
        </motion.a>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          #contact > div:nth-child(5) {
            flex-direction: column !important;
            gap: 48px !important;
          }
          #contact > div:nth-child(5) > div:first-child {
            flex: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}