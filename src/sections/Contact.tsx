import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionHeading from '@/components/SectionHeading'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
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

export default function Contact() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-black py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <SectionHeading
            title="Connect"
            subtitle="Let's create something extraordinary"
            align="center"
          />
        </div>

        {/* Contact Content */}
        <motion.div
          ref={contentRef}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col items-center gap-12"
        >
          {/* Business Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4 text-center"
          >
            <h3 className="font-heading text-3xl font-light text-cream md:text-4xl">
              Bermoda Fashion Business
            </h3>
            <div className="flex flex-col gap-2 font-body text-base text-cream-muted md:text-lg">
              <p>Bogotá, Colombia</p>
            </div>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            variants={lineVariants}
            className="h-px w-12 bg-gradient-to-r from-gold to-transparent"
          />

          {/* Instagram section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col items-center gap-3">
              <p className="font-body text-sm uppercase tracking-widest text-gold">
                Follow on Instagram
              </p>
              <h2 className="font-heading text-5xl font-light text-cream md:text-6xl">
                @anabernal.moda
              </h2>
            </div>

            {/* Instagram button */}
            <motion.a
              href="https://instagram.com/anabernal.moda"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-5 rounded-none border-2 border-gold font-body text-sm tracking-wider uppercase text-cream transition-all duration-500 hover:bg-gold hover:text-black overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background fill effect */}
              <div className="absolute inset-0 bg-gold origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6 transition-transform group-hover:rotate-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.3 2c-2.1 0-3.5 1.4-3.5 3.5v8.5c0 2.1 1.4 3.5 3.5 3.5h8.5c2.1 0 3.5-1.4 3.5-3.5V7.5c0-2.1-1.4-3.5-3.5-3.5H7.5m9.3 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3m-5 1a4 4 0 110 8 4 4 0 010-8m0 2a2 2 0 100 4 2 2 0 000-4" />
                </svg>
                Follow Now
              </span>
            </motion.a>
          </motion.div>

          {/* Additional contact info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4 pt-8 border-t border-gold/20"
          >
            <p className="font-body text-sm text-cream-muted text-center max-w-md">
              For collaborations, press inquiries, and custom commissions, reach out through Instagram
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </section>
  )
}
