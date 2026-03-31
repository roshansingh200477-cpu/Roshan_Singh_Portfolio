import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function ProjectCard({ title, description, tags, status, liveUrl, githubUrl, index, featured }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  

  const springConfig = { stiffness: 140, damping: 16 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig)
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig)
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig)
  const scale = useSpring(1, springConfig)

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
    scale.set(1.02)
  }
  const handleMouseLeave = () => {
    x.set(0); y.set(0); scale.set(1)
  }

  const statusMap = {
    completed:   { label: 'Live', color: '#34d399', bg: 'rgba(52,211,153,0.08)', dot: true },
    'in-progress': { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', dot: true },
  }
  const s = statusMap[status] || statusMap.completed

  const projectIcons = {
    'Verifeye': '🔍',
    'NoteNest': '📝',
    'SaaS Dashboard': '📊',
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX, rotateY, scale,
        transformStyle: 'preserve-3d',
        perspective: 1200,
        position: 'relative',
      }}
    >
      {/* Outer glow on hover */}
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(52,211,153,0.18) 0%, transparent 60%)`,
          position: 'absolute', inset: '-1px',
          borderRadius: '20px', zIndex: 0,
          opacity: 0, transition: 'opacity 0.4s ease',
        }}
        className="card-glow"
      />

      {/* Featured badge */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.18 + 0.4 }}
          style={{
            position: 'absolute', top: '-14px', left: '20px',
            padding: '4px 14px', borderRadius: '999px',
            background: 'linear-gradient(90deg, #34d399, #6ee7b7)',
            fontSize: '10px', fontFamily: 'Syne, sans-serif',
            fontWeight: '700', color: '#0a0a0a',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            zIndex: 20,
            boxShadow: '0 0 20px rgba(52,211,153,0.4)',
          }}
        >
          ✦ Featured
        </motion.div>
      )}

      {/* Card body */}
      <div
        style={{
          position: 'relative', zIndex: 10,
          borderRadius: '20px', padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '20px',
          minHeight: '320px',
          background: featured
            ? 'linear-gradient(135deg, rgba(52,211,153,0.07) 0%, rgba(255,255,255,0.025) 60%)'
            : 'rgba(255,255,255,0.025)',
          border: featured
            ? '1px solid rgba(52,211,153,0.25)'
            : '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          transform: 'translateZ(20px)',
          transition: 'border-color 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = featured ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.14)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = featured ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Icon */}
          <motion.div
            style={{
              width: '52px', height: '52px',
              borderRadius: '14px',
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
              transform: 'translateZ(40px)',
            }}
            whileHover={{ scale: 1.12, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {projectIcons[title] || '🚀'}
          </motion.div>

          {/* Status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '999px',
            background: s.bg, border: `1px solid ${s.color}33`,
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: s.color,
              animation: 'blink 2s infinite',
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '11px', color: s.color,
              fontFamily: 'Syne, sans-serif', fontWeight: '600',
              letterSpacing: '0.05em',
            }}>
              {s.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <motion.h3
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: '800',
            fontSize: '22px', color: 'white',
            letterSpacing: '-0.02em', lineHeight: 1.2,
            transform: 'translateZ(30px)',
          }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <p style={{
          fontSize: '13px', lineHeight: '1.85',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: 'Inter, sans-serif',
          flex: 1,
        }}>
          {description}
        </p>

        {/* Tags */}
        <motion.div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '6px',
            transform: 'translateZ(25px)',
          }}
        >
          {tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px', borderRadius: '6px',
              background: 'rgba(52,211,153,0.05)',
              border: '1px solid rgba(52,211,153,0.13)',
              color: 'rgba(52,211,153,0.75)',
              fontSize: '11px', fontFamily: 'Syne, sans-serif',
              fontWeight: '500', letterSpacing: '0.03em',
            }}>
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Action buttons */}
        <div style={{
          display: 'flex', gap: '10px',
          transform: 'translateZ(35px)',
          paddingTop: '4px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {liveUrl && (
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: '#34d399', color: '#0a0a0a' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                flex: 1, padding: '9px 0',
                borderRadius: '10px', textAlign: 'center',
                border: '1px solid #34d399', color: '#34d399',
                fontSize: '12px', fontFamily: 'Syne, sans-serif',
                fontWeight: '600', textDecoration: 'none',
                backgroundColor: 'transparent',
                letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '5px',
              }}
            >
              ↗ Live Demo
            </motion.a>
          )}

          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                flex: 1, padding: '9px 0',
                borderRadius: '10px', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
                fontSize: '12px', fontFamily: 'Syne, sans-serif',
                fontWeight: '600', textDecoration: 'none',
                backgroundColor: 'transparent',
                letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '5px',
              }}
            >
              ⌥ GitHub
            </motion.a>
          )}

          {!liveUrl && !githubUrl && (
            <div style={{
              flex: 1, padding: '9px 0', borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid rgba(245,158,11,0.2)',
              color: 'rgba(245,158,11,0.5)',
              fontSize: '12px', fontFamily: 'Syne, sans-serif',
              fontWeight: '600', letterSpacing: '0.05em',
            }}>
              ⚡ In Development
            </div>
          )}
        </div>
      </div>

      <style>{`
        .card-glow { pointer-events: none; }
        div:hover > .card-glow { opacity: 1 !important; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </motion.div>
  )
}