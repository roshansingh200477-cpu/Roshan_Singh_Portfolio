import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const categories = [
  {
    label: 'Frontend',
    icon: '⬡',
    skills: [
      { name: 'React.js', level: 88, color: '#61dafb' },
      { name: 'JavaScript', level: 85, color: '#f7df1e' },
      { name: 'Tailwind CSS', level: 80, color: '#38bdf8' },
      { name: 'HTML & CSS', level: 95, color: '#e34c26' },
      { name: 'Framer Motion', level: 70, color: '#ff0055' },
    ],
  },
  {
    label: 'Backend',
    icon: '◈',
    skills: [
      { name: 'Node.js', level: 80, color: '#68a063' },
      { name: 'Express.js', level: 80, color: '#ffffff' },
      { name: 'FastAPI', level: 65, color: '#009688' },
      { name: 'REST APIs', level: 82, color: '#34d399' },
      { name: 'JWT Auth', level: 80, color: '#f59e0b' },
    ],
  },
  {
    label: 'Database',
    icon: '✦',
    skills: [
      { name: 'MongoDB', level: 80, color: '#47a248' },
      { name: 'Mongoose', level: 78, color: '#880000' },
      { name: 'PostgreSQL', level: 55, color: '#336791' },
      { name: 'SQL', level: 65, color: '#5a67d8' },
    ],
  },
  {
    label: 'Tools',
    icon: '❋',
    skills: [
      { name: 'Git & GitHub', level: 85, color: '#f05032' },
      { name: 'VS Code', level: 95, color: '#007acc' },
      { name: 'Vercel', level: 82, color: '#ffffff' },
      { name: 'Postman', level: 80, color: '#ff6c37' },
      { name: 'Docker', level: 45, color: '#2496ed' },
    ],
  },
]

const allSkillNames = [
  'React', 'Node', 'MongoDB', 'Express', 'Tailwind',
  'FastAPI', 'Git', 'Vercel',
  'Docker', 'JWT', 'REST', 'HTML', 'CSS',
]

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return width
}

function ParticleField({ canvasRef, mouseRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200)
    camera.position.z = 30

    const count = 280
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color: 0x34d399, size: 0.25,
      transparent: true, opacity: 0.35,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    const cubes = allSkillNames.slice(0, 8).map(() => {
      const size = 0.8 + Math.random() * 0.6
      const geo = new THREE.BoxGeometry(size, size, size)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x34d399, wireframe: true,
        transparent: true, opacity: 0.08 + Math.random() * 0.06,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
      )
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.008,
        vy: (Math.random() - 0.5) * 0.006,
        rx: Math.random() * 0.01,
        ry: Math.random() * 0.01,
      }
      scene.add(mesh)
      return mesh
    })

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const pl = new THREE.PointLight(0x34d399, 2, 60)
    pl.position.set(10, 10, 10)
    scene.add(pl)

    let fId
    const clock = new THREE.Clock()
    const animate = () => {
      fId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      particles.rotation.y = t * 0.02
      particles.rotation.x = t * 0.01
      if (mouseRef.current) {
        particles.rotation.y += mouseRef.current.x * 0.0003
        particles.rotation.x += mouseRef.current.y * 0.0002
      }
      cubes.forEach((cube) => {
        cube.rotation.x += cube.userData.rx
        cube.rotation.y += cube.userData.ry
        cube.position.x += cube.userData.vx
        cube.position.y += cube.userData.vy
        if (Math.abs(cube.position.x) > 30) cube.userData.vx *= -1
        if (Math.abs(cube.position.y) > 18) cube.userData.vy *= -1
      })
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

function SkillBar({ skill, index, isInView }) {
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setFilled(true), index * 80 + 200)
      return () => clearTimeout(t)
    }
  }, [isInView, index])

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ scale: 1.02 }}
      style={{
        padding: '14px 18px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'default',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${skill.color}40`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '10px',
      }}>
        <span style={{
          fontSize: '13px', fontFamily: 'Syne, sans-serif',
          fontWeight: '600', color: 'rgba(255,255,255,0.85)',
        }}>
          {skill.name}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={filled ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.07 + 0.6 }}
          style={{
            fontSize: '11px', fontFamily: 'Inter, sans-serif',
            fontWeight: '600', color: skill.color,
            letterSpacing: '0.05em',
          }}
        >
          {skill.level}%
        </motion.span>
      </div>

      <div style={{
        height: '4px', borderRadius: '999px',
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden', position: 'relative',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: filled ? `${skill.level}%` : 0 }}
          transition={{ duration: 1.2, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            borderRadius: '999px',
            background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
          }}
        />
        {filled && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '400%' }}
            transition={{ duration: 1.5, delay: index * 0.07 + 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: 0, bottom: 0,
              width: '30%', borderRadius: '999px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        )}
      </div>

      {filled && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.07 + 1.0, duration: 0.3 }}
          style={{
            position: 'relative',
            marginTop: '-8px',
            marginLeft: `calc(${skill.level}% - 4px)`,
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: skill.color,
            boxShadow: `0 0 8px ${skill.color}`,
          }}
        />
      )}
    </motion.div>
  )
}

export default function SkillsSection() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [activeTab, setActiveTab] = useState(0)
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 768

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

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0c0c0c',
        overflow: 'hidden',
        padding: isMobile ? '60px 0' : '100px 0',
      }}
    >
      {/* Top divider */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)',
      }} />

      {/* 3D Particle background */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', zIndex: 0,
      }} />
      <ParticleField canvasRef={canvasRef} mouseRef={mouseRef} />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, rgba(12,12,12,0.7) 40%, rgba(12,12,12,0.95) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '1100px', margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 60px',
        boxSizing: 'border-box',
      }}>

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '60px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ width: '24px', height: '1px', background: '#34d399' }} />
            <span style={{
              fontSize: '11px', color: '#34d399',
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Skills & Expertise
            </span>
            <div style={{ width: '24px', height: '1px', background: '#34d399' }} />
          </div>

          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: '800',
            fontSize: 'clamp(28px, 4.5vw, 56px)',
            color: 'white', letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: '16px',
          }}>
            What I work with
          </h2>

          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Inter, sans-serif', lineHeight: '1.8',
            maxWidth: '420px', margin: '0 auto',
          }}>
            Technologies and tools I use to build fast, production-ready applications.
          </p>
        </motion.div>

        {/* ── Tab Switcher ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            overflowX: isMobile ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            marginBottom: '48px',
            paddingBottom: isMobile ? '4px' : '0',
          }}
        >
          <div style={{
            display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '999px', padding: '6px',
            width: 'fit-content',
            margin: isMobile ? '0 auto' : '0 auto',
            minWidth: isMobile ? 'max-content' : 'auto',
          }}>
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveTab(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'relative',
                  padding: isMobile ? '8px 14px' : '9px 22px',
                  borderRadius: '999px', border: 'none',
                  background: activeTab === i ? 'rgba(52,211,153,0.12)' : 'transparent',
                  color: activeTab === i ? '#34d399' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'Syne, sans-serif', fontWeight: '600',
                  fontSize: isMobile ? '12px' : '13px',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  transition: 'color 0.2s ease',
                  display: 'flex', alignItems: 'center',
                  gap: isMobile ? '4px' : '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="tabBg"
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '999px',
                      background: 'rgba(52,211,153,0.1)',
                      border: '1px solid rgba(52,211,153,0.25)',
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{cat.icon}</span>
                <span style={{ position: 'relative', zIndex: 1 }}>{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Skill Bars Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {categories[activeTab].skills.map((skill, i) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                index={i}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom floating tech marquee ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            marginTop: isMobile ? '40px' : '64px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: '80px', zIndex: 2,
            background: 'linear-gradient(90deg, #0c0c0c, transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '80px', zIndex: 2,
            background: 'linear-gradient(-90deg, #0c0c0c, transparent)',
            pointerEvents: 'none',
          }} />

          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: '16px', width: 'max-content' }}
          >
            {[...allSkillNames, ...allSkillNames, ...allSkillNames].map((name, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(52,211,153,0.12)',
                  background: 'rgba(52,211,153,0.04)',
                  color: 'rgba(255,255,255,0.25)',
                  fontSize: '12px',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: '500',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent)',
      }} />
    </section>
  )
}