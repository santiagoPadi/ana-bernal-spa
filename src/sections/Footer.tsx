import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

export default function Footer() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  return (
    <footer
      ref={sectionRef}
      className="relative bg-black border-t border-gold/20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <motion.div
          className="flex flex-col items-center gap-8"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {/* Top decorative line */}
          <motion.div
            variants={lineVariants}
            className="h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent"
          />

          {/* Logo */}
          <motion.div variants={itemVariants} className="text-center">
            <img
              src="/images/logo-be-gold.png"
              alt="Ana Bernal"
              className="h-20 md:h-24 w-auto mx-auto"
            />
          </motion.div>

          {/* Copyright */}
          <motion.div
            variants={itemVariants}
            className="text-center font-body text-xs uppercase tracking-widest text-cream"
          >
            <p>© 2025 Ana María Bernal. All rights reserved.</p>
          </motion.div>

          {/* Location tagline */}
          <motion.div
            variants={itemVariants}
            className="text-center font-body text-xs text-cream-muted"
          >
            <p>Designed with passion in Bogotá, Colombia</p>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            variants={lineVariants}
            className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent mt-4"
          />
        </motion.div>
      </div>

      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
    </footer>
  )
}
