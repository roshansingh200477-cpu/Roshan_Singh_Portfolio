import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Skills',   href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact',  href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const active = location.pathname

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'background 0.4s ease, border 0.4s ease',
        }}
      >
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.04 }}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-white font-bold text-xl tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Roshan Singh<span style={{ color: '#34d399' }}>.</span>
          </Link>
        </motion.div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="relative text-sm tracking-wide transition-colors duration-200"
                style={{
                  color: active === link.href ? '#34d399' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'Syne, sans-serif',
                }}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-px"
                    style={{ background: '#34d399' }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <motion.a
          href="/Roshan_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            border: '1px solid rgba(52,211,153,0.4)',
            color: '#34d399',
            fontFamily: 'Syne, sans-serif',
          }}
          whileHover={{
            backgroundColor: 'rgba(52,211,153,0.08)',
            borderColor: '#34d399',
          }}
          transition={{ duration: 0.2 }}
        >
          Resume ↗
        </motion.a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px bg-white origin-center"
            style={{ transition: 'all 0.3s ease' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-px bg-white"
            style={{ transition: 'all 0.3s ease' }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px bg-white origin-center"
            style={{ transition: 'all 0.3s ease' }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-16 left-4 right-4 z-40 rounded-2xl p-6 flex flex-col gap-4 md:hidden"
            style={{
              background: 'rgba(15,15,15,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-medium py-2 border-b"
                  style={{
                    color: active === link.href ? '#34d399' : 'rgba(255,255,255,0.7)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center py-3 rounded-full text-sm font-medium"
              style={{
                border: '1px solid rgba(52,211,153,0.4)',
                color: '#34d399',
                fontFamily: 'Syne, sans-serif',
              }}
            >
              Resume ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}