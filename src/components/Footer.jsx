import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView, useMotionValue, useSpring } from 'framer-motion'

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/yourusername',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

const languages = ['JavaScript', 'Python', 'HTML', 'CSS']
const frameworks = ['React', 'Node.js', 'Express', 'Tailwind CSS']
const tools = ['Git', 'Vite', 'MongoDB', 'PostgreSQL']

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

const resources = [
  { label: 'MDN Web Docs', href: 'https://developer.mozilla.org' },
  { label: 'React Docs', href: 'https://react.dev' },
  { label: 'Frontend Mentor', href: 'https://frontendmentor.io' },
  { label: 'CSS Tricks', href: 'https://css-tricks.com' },
]

function FloatingOrb({ size, x, y, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }}
      animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0a0a0a 0%, #060606 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Background orbs */}
      <FloatingOrb size={350} x="-5%" y="-20%" delay={0} duration={7} />
      <FloatingOrb size={250} x="70%" y="10%" delay={2} duration={9} />
      <FloatingOrb size={180} x="40%" y="50%" delay={1} duration={6} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(52,211,153,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.02) 1px, transparent 1px)',
          backgroundSize: '55px 55px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative max-w-6xl mx-auto px-6 pt-20 pb-10"
      >

        {/* Big animated name */}
        <motion.div variants={itemVariants} className="mb-14">
          <motion.h2
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            style={{
              fontFamily: 'Syne, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #34d399 60%, rgba(255,255,255,0.3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Roshan Singh.
          </motion.h2>
          <motion.p
            className="mt-4 text-lg font-medium"
            style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
          >
            Frontend Developer · React Specialist
          </motion.p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1 — About */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h4
              className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold"
              style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
            >
              About Me
            </h4>
            <p
              className="text-sm leading-7"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Syne, sans-serif' }}
            >
              Passionate about creating fast, intuitive, and beautiful web experiences.
              I specialize in transforming ideas into crafted digital products using React
              and modern frontend technologies.
            </p>

            {/* Open to work */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mt-5"
              style={{
                border: '1px solid rgba(52,211,153,0.35)',
                background: 'rgba(52,211,153,0.07)',
              }}
              animate={{
                boxShadow: [
                  '0 0 0px rgba(52,211,153,0)',
                  '0 0 14px rgba(52,211,153,0.2)',
                  '0 0 0px rgba(52,211,153,0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-xs font-medium"
                style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
              >
                Open to work
              </span>
            </motion.div>
          </motion.div>

          {/* Column 2 — Tech Stack */}
          <motion.div variants={itemVariants}>
            <h4
              className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold"
              style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
            >
              Tech Stack
            </h4>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Syne, sans-serif' }}>
                  Languages
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map(l => (
                    <span
                      key={l}
                      className="text-xs px-2.5 py-1 rounded-md"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.65)',
                        fontFamily: 'Syne, sans-serif',
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Syne, sans-serif' }}>
                  Frameworks
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {frameworks.map(f => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-md"
                      style={{
                        background: 'rgba(52,211,153,0.06)',
                        border: '1px solid rgba(52,211,153,0.15)',
                        color: 'rgba(52,211,153,0.85)',
                        fontFamily: 'Syne, sans-serif',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Syne, sans-serif' }}>
                  Tools
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map(t => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'Syne, sans-serif',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3 — Navigation */}
          <motion.div variants={itemVariants}>
            <h4
              className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold"
              style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
            >
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5">
              {navLinks.map(link => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-sm flex items-center gap-2 group w-fit"
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Syne, sans-serif' }}
                  whileHover={{ x: 5, color: '#ffffff' }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#34d399' }}
                  >
                    →
                  </span>
                  {link.label}
                </motion.a>
              ))}

              <div
                className="my-2 h-px w-full"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />

              <h4
                className="text-xs tracking-[0.25em] uppercase mb-2 font-semibold"
                style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
              >
                Learn Frontend
              </h4>
              {resources.map(r => (
                <motion.a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-2 group w-fit"
                  style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif' }}
                  whileHover={{ x: 5, color: '#34d399' }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#34d399' }}>↗</span>
                  {r.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 4 — Contact */}
          <motion.div variants={itemVariants}>
            <h4
              className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold"
              style={{ color: '#34d399', fontFamily: 'Syne, sans-serif' }}
            >
              Get In Touch
            </h4>
            <p
              className="text-sm leading-6 mb-5"
              style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Syne, sans-serif' }}
            >
              Have a project in mind or just want to say hi? My inbox is always open.
            </p>

            {/* Email */}
            <motion.a
              href="mailto:roshan@example.com"
              className="flex items-center gap-2 text-sm mb-6 group"
              style={{ color: '#ffffff', fontFamily: 'Syne, sans-serif' }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                <svg width="14" height="14" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              roshansingh200477@gmail.com
            </motion.a>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(social => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  whileHover={{
                    scale: 1.15,
                    borderColor: 'rgba(52,211,153,0.5)',
                    color: '#34d399',
                    backgroundColor: 'rgba(52,211,153,0.08)',
                    y: -3,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-full h-px mb-8"
          style={{ background: 'linear-gradient(to right, transparent, rgba(52,211,153,0.3), transparent)' }}
        />

        {/* Bottom bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p
            className="text-xs text-center md:text-left"
            style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Syne, sans-serif' }}
          >
            © {new Date().getFullYear()} Roshan Singh · Designed & built with React, Tailwind CSS & Framer Motion
          </p>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'Syne, sans-serif',
            }}
            whileHover={{
              borderColor: 'rgba(52,211,153,0.5)',
              color: '#34d399',
              y: -2,
              backgroundColor: 'rgba(52,211,153,0.05)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↑
            </motion.span>
            Back to top
          </motion.button>
        </motion.div>
      </motion.div>
    </footer>
  )
}