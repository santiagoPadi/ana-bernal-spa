import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
import Particles from '../components/Particles'
import { heroImages } from '@/data/images'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.6,
    },
  },
}

const chevronVariants = {
  initial: { y: 0, opacity: 0.6 },
  animate: {
    y: [0, 8, 0],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export default function Hero() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollIndicatorRef.current) {
        const scrollProgress = window.scrollY / window.innerHeight
        scrollIndicatorRef.current.style.opacity = Math.max(0, 1 - scrollProgress * 2).toString()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <img
          src={heroImages[0]}
          alt="Hero background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Three.js Canvas - Particles Layer */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          className="h-full w-full"
          style={{ background: 'transparent' }}
        >
          <Particles />
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-col items-center gap-8"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="font-body">
            <p className="text-xs font-light tracking-[0.3em] uppercase text-cream">
              Fashion Designer
            </p>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="max-w-4xl">
            <h1 className="font-heading text-6xl font-light tracking-tight text-cream md:text-8xl xl:text-9xl">
              Ana María
            </h1>
            <h1 className="font-heading text-6xl font-light tracking-tight text-cream md:text-8xl xl:text-9xl">
              Bernal
            </h1>
          </motion.div>

          {/* Gold Line */}
          <motion.div
            variants={lineVariants}
            className="h-px w-32 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
            style={{ transformOrigin: 'center' }}
          />

          {/* Quote */}
          <motion.div variants={itemVariants} className="max-w-2xl font-accent">
            <p className="text-lg italic text-cream md:text-xl">
              La moda no es solo ropa; es lenguaje, actitud y significado.
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          ref={scrollIndicatorRef}
          variants={chevronVariants}
          initial="initial"
          animate="animate"
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <svg
            className="h-6 w-6 stroke-gold"
            fill="none"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}
