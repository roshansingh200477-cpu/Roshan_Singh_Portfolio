import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'
import ProjectCard from '../components/ProjectCard'

const projects = [
  {
    title: 'Verifeye',
    description:
      'A full-stack fake news detection system built as a BCA final project. Uses a React frontend, Express backend for auth, and a FastAPI microservice running NLP models to classify news articles as real or fake in real time. Deployed across Vercel, Render, and MongoDB Atlas with UptimeRobot monitoring.',
    tags: ['React', 'FastAPI', 'Python', 'NLP', 'Express', 'MongoDB', 'Vercel'],
    status: 'completed',
    liveUrl: 'https://verifeye-lac.vercel.app',
    githubUrl: 'https://github.com/roshansingh200477-cpu/fake-news-detection-system',
    featured: true,
  },
  {
    title: 'NoteNest',
    description:
      'A full-stack virtual note-taking app where users can create, organize, and manage notes with a clean dark UI. Built with React and Bootstrap on the frontend, and a secure Node.js/Express REST API with MongoDB for persistent storage and JWT-based authentication.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Bootstrap', 'JWT'],
    status: 'completed',
    liveUrl: null,
    githubUrl: 'https://github.com/roshansingh200477-cpu/React-project-iNotebook',
    featured: false,
  },
  {
    title: 'SaaS Dashboard',
    description:
      'A multi-tenant SaaS analytics dashboard in active development. Supports role-based access control, tenant data isolation, and a polished admin UI. Built with React, Tailwind, Node/Express, Prisma ORM, and PostgreSQL via Neon DB.',
    tags: ['React', 'Tailwind', 'Node.js', 'Prisma', 'PostgreSQL', 'Neon', 'SaaS'],
    status: 'in-progress',
    liveUrl: null,
    githubUrl: null,
    featured: false,
  },
]

const stats = [
  { value: 3, suffix: '', label: 'Projects Built' },
  { value: 7, suffix: '+', label: 'Technologies Used' },
  { value: 1, suffix: '', label: 'Live in Production' },
]

function Counter({ value, suffix, isInView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = Math.ceil(value / 40)
    const id = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(id) }
      else setCount(start)
    }, 30)
    return () => clearInterval(id)
  }, [isInView, value])
  return <>{count}{suffix}</>
}

function ProjectsBg({ canvasRef, mouseRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200)
    camera.position.z = 28

    scene.add(new THREE.AmbientLight(0xffffff, 0.15))
    const pl = new THREE.PointLight(0x34d399, 2, 80)
    pl.position.set(0, 0, 10)
    scene.add(pl)

    const orbs = Array.from({ length: 6 }, (_, i) => {
      const r = 0.4 + Math.random() * 0.6
      const geo = new THREE.SphereGeometry(r, 16, 16)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x34d399, transparent: true,
        opacity: 0.06 + Math.random() * 0.06,
        roughness: 0.1, metalness: 0.9,
        wireframe: i % 2 === 0,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
      )
      mesh.userData = {
        vy: (Math.random() - 0.5) * 0.012,
        vx: (Math.random() - 0.5) * 0.008,
        r: Math.random() * 0.008,
      }
      scene.add(mesh)
      return mesh
    })

    const count = 200
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 90
      pos[i * 3 + 1] = (Math.random() - 0.5) * 55
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x34d399, size: 0.18,
      transparent: true, opacity: 0.28,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    const ringGeo = new THREE.TorusGeometry(14, 0.015, 8, 200)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x34d399, transparent: true, opacity: 0.05,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 3
    scene.add(ring)

    let fId
    const clock = new THREE.Clock()
    const animate = () => {
      fId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      particles.rotation.y = t * 0.015
      ring.rotation.z = t * 0.03
      if (mouseRef.current) {
        particles.rotation.y += mouseRef.current.x * 0.00015
        particles.rotation.x += mouseRef.current.y * 0.0001
      }
      orbs.forEach(orb => {
        orb.rotation.y += orb.userData.r
        orb.position.x += orb.userData.vx
        orb.position.y += orb.userData.vy
        if (Math.abs(orb.position.x) > 28) orb.userData.vx *= -1
        if (Math.abs(orb.position.y) > 18) orb.userData.vy *= -1
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

// ── Responsive hook ───────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState({
    isMobile: false,
    isTablet: false,
  })
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBp({
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return bp
}

export default function ProjectsSection() {
  const canvasRef  = useRef(null)
  const mouseRef   = useRef({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' })
  const { isMobile, isTablet } = useBreakpoint()

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

  // Responsive values
  const sectionPadding   = isMobile ? '80px 0 100px' : '100px 0 120px'
  const contentPadding   = isMobile ? '0 20px' : isTablet ? '0 32px' : '0 60px'
  const headingSize      = isMobile ? 'clamp(32px, 8vw, 48px)' : 'clamp(36px, 5vw, 64px)'
  const statsGap         = isMobile ? '24px' : '40px'
  const statsMarginB     = isMobile ? '40px' : '56px'
  const statsPaddingB    = isMobile ? '28px' : '40px'
  const statsFontSize    = isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(28px, 3.5vw, 44px)'
  const cardsGap         = isMobile ? '16px' : '20px'
  const ctaMarginTop     = isMobile ? '40px' : '56px'

  // Cards grid: 1 col mobile, 2 col tablet, auto-fit desktop
  const cardsGridCols    = isMobile
    ? '1fr'
    : isTablet
    ? 'repeat(2, 1fr)'
    : 'repeat(auto-fit, minmax(300px, 1fr))'

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        padding: sectionPadding,
      }}
    >
      {/* Top divider */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)',
      }} />

      {/* 3D canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', zIndex: 0,
      }} />
      <ProjectsBg canvasRef={canvasRef} mouseRef={mouseRef} />

      {/* Dark center overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.75) 30%, rgba(10,10,10,0.96) 100%)',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '1100px', margin: '0 auto',
        padding: contentPadding,
      }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '20px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ width: '24px', height: '1px', background: '#34d399' }} />
            <span style={{
              fontSize: '11px', color: '#34d399',
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Portfolio
            </span>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: headingSize,
                color: 'white', letterSpacing: '-0.03em',
                lineHeight: 1.05, marginBottom: '0',
              }}
            >
              Things I've
            </motion.h2>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: headingSize,
                WebkitTextStroke: '1.5px rgba(255,255,255,0.2)',
                color: 'transparent',
                letterSpacing: '-0.03em', lineHeight: 1.05,
                marginBottom: '20px',
              }}
            >
              Built
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: isMobile ? '14px' : '15px',
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'Inter, sans-serif', lineHeight: '1.8',
              maxWidth: isMobile ? '100%' : '440px',
            }}
          >
            From ML-powered tools to full-stack web apps — real projects
            solving real problems, deployed and live.
          </motion.p>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            display: 'flex', gap: statsGap,
            marginBottom: statsMarginB,
            paddingBottom: statsPaddingB,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={{ minWidth: isMobile ? 'calc(33% - 16px)' : 'auto' }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: '800',
                fontSize: statsFontSize,
                color: '#34d399', lineHeight: 1, marginBottom: '4px',
              }}>
                <Counter value={stat.value} suffix={stat.suffix} isInView={isInView} />
              </div>
              <div style={{
                fontSize: isMobile ? '9px' : '10px',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Cards grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: cardsGridCols,
          gap: cardsGap,
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.title} {...project} index={i} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            marginTop: ctaMarginTop, textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.25)',
            fontFamily: 'Inter, sans-serif', marginBottom: '16px',
            letterSpacing: '0.05em',
          }}>
            More projects on GitHub
          </p>
          <motion.a
            href="https://github.com/roshansingh200477-cpu"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(52,211,153,0.08)', borderColor: '#34d399', color: '#34d399' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: isMobile ? '11px 22px' : '12px 28px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
              fontSize: isMobile ? '12px' : '13px',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease',
            }}
          >
            ⌥ View GitHub Profile →
          </motion.a>
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