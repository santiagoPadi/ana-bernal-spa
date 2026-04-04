import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

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

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
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

export default function About() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const imageRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-charcoal py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          {/* Left Column - Image */}
          <motion.div
            ref={imageRef}
            variants={imageVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Gold corner decorations */}
            <div className="absolute -left-4 -top-4 z-20 h-8 w-8 border-l-2 border-t-2 border-gold md:-left-6 md:-top-6 md:h-12 md:w-12" />
            <div className="absolute -bottom-4 -right-4 z-20 h-8 w-8 border-b-2 border-r-2 border-gold md:-bottom-6 md:-right-6 md:h-12 md:w-12" />

            {/* Image with gold border frame */}
            <div className="group relative overflow-hidden border-2 border-gold/30 bg-black">
              <motion.img
                src="/images/ana-taller.jpg"
                alt="Ana María Bernal in her workshop with KQM embroidery machines"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />

              {/* Gold border effect on hover */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Bottom right gold accent */}
            <div className="absolute -bottom-3 -right-3 z-10 h-12 w-12 border-r-2 border-gold/50" />
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* Section Label */}
            <motion.div variants={itemVariants}>
              <p className="font-body text-xs font-light tracking-[0.2em] uppercase text-gold">
                About
              </p>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants}>
              <h2 className="font-heading text-4xl font-light leading-tight text-cream md:text-5xl">
                The Designer
              </h2>
            </motion.div>

            {/* Gold decorative line */}
            <motion.div
              variants={lineVariants}
              className="h-px w-16 origin-left bg-gradient-to-r from-gold to-transparent"
            />

            {/* Bio paragraphs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 font-body text-base leading-relaxed text-cream md:gap-6 md:text-lg"
            >
              <p>
                Ana María Bernal is a Colombian fashion designer based in Bogotá, whose work
                bridges the worlds of haute couture and contemporary streetwear. From her atelier
                in Cundinamarca, she crafts collections that speak a language of power, sensuality,
                and meticulous precision.
              </p>

              <p>
                As the founder of Bermoda Fashion Business and a pioneer in importing KQM
                embroidery machines to Colombia, Ana combines artisanal craftsmanship with
                cutting-edge technology. Her journey from WorldSkills gold medalist to acclaimed
                runway designer reflects an unwavering commitment to excellence.
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 border-t border-gold/20 pt-8 md:gap-8"
            >
              {/* Stat 1 */}
              <div className="flex flex-col items-start gap-1">
                <p className="font-accent text-2xl font-light text-gold md:text-3xl">5+</p>
                <p className="font-body text-xs uppercase tracking-wider text-cream/70">
                  Collections
                </p>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-start gap-1">
                <p className="font-accent text-2xl font-light text-gold md:text-3xl">2021</p>
                <p className="font-body text-xs uppercase tracking-wider text-cream/70">
                  WorldSkills Gold
                </p>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-start gap-1">
                <p className="font-accent text-2xl font-light text-gold md:text-3xl">Bogotá</p>
                <p className="font-body text-xs uppercase tracking-wider text-cream/70">
                  Based
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/20" />
    </section>
  )
}
