import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import GrainOverlay from './components/GrainOverlay'
import SmoothScroll from './components/SmoothScroll'
import CustomCursor from './components/CustomCursor'

const Hero = lazy(() => import('./sections/Hero'))
const About = lazy(() => import('./sections/About'))
const Philosophy = lazy(() => import('./sections/Philosophy'))
const Collections = lazy(() => import('./sections/Collections'))
const Achievements = lazy(() => import('./sections/Achievements'))
const Gallery = lazy(() => import('./sections/Gallery'))
const Contact = lazy(() => import('./sections/Contact'))
const Upcoming = lazy(() => import('./sections/Upcoming'))
const Footer = lazy(() => import('./sections/Footer'))

export default function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-black">
        <GrainOverlay />
        <CustomCursor />
        <Navbar />
        <Suspense fallback={<Loader />}>
          <main>
            <Hero />
            <About />
            <Philosophy />
            <Collections />
            <Upcoming />
            <Achievements />
            <Gallery />
            <Contact />
            <Footer />
          </main>
        </Suspense>
      </div>
    </SmoothScroll>
  )
}
