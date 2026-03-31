import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AboutSection from './sections/AboutSection'
import ContactSection from './sections/ContactSection'
import HeroSection from './sections/HeroSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import Footer from './components/Footer'

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/about"    element={<AboutSection />} />
          <Route path="/skills"   element={<SkillsSection />} />
          <Route path="/projects" element={<ProjectsSection />} />
          <Route path="/contact"  element={<ContactSection />} />
        </Routes>
        <Footer/>
      </main>
    </BrowserRouter>
  )
}