import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionHeading from '@/components/SectionHeading'
import { galleryGrid } from '@/data/images'

const INITIAL_COUNT = 12

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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

export default function Gallery() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [showMore, setShowMore] = useState(false)

  const visibleImages = showMore ? galleryGrid : galleryGrid.slice(0, INITIAL_COUNT)
  const remainingCount = galleryGrid.length - INITIAL_COUNT

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative bg-charcoal py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <SectionHeading
            title="Atelier"
            subtitle="Behind the scenes at Bermoda Fashion Business"
            align="center"
          />
        </div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-8 md:gap-10"
        >
          {/* Image Grid */}
          <div className="grid gap-4 md:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleImages.map((imageSrc, index) => (
              <motion.div
                key={imageSrc}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg border border-gold/10 aspect-square"
              >
                <img
                  src={imageSrc}
                  alt={`Ana Bernal fashion design ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading={index < 8 ? 'eager' : 'lazy'}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-0 pointer-events-none border border-gold/0 rounded-lg transition-colors duration-500 group-hover:border-gold/40" />
              </motion.div>
            ))}
          </div>

          {/* View All / Show Less Button */}
          {remainingCount > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex justify-center pt-4"
            >
              <motion.button
                onClick={() => setShowMore(!showMore)}
                className="group relative px-8 py-4 rounded-none border-2 border-gold font-body text-sm tracking-wider uppercase text-cream transition-all duration-500 hover:bg-gold hover:text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {showMore ? 'Show Less' : `View All ${galleryGrid.length} Designs`}
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* Instagram CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-6 py-12 md:py-16"
          >
            <div className="flex flex-col items-center gap-3">
              <h3 className="font-heading text-2xl font-light text-cream md:text-3xl">
                Follow the Journey
              </h3>
              <p className="font-body text-cream text-center max-w-md">
                Stay connected for exclusive behind-the-scenes moments and collection updates
              </p>
            </div>

            <motion.a
              href="https://instagram.com/anabernal.moda"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 rounded-none border-2 border-gold font-body text-sm tracking-wider uppercase text-cream transition-all duration-500 hover:bg-gold hover:text-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.3 2c-2.1 0-3.5 1.4-3.5 3.5v8.5c0 2.1 1.4 3.5 3.5 3.5h8.5c2.1 0 3.5-1.4 3.5-3.5V7.5c0-2.1-1.4-3.5-3.5-3.5H7.5m9.3 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3m-5 1a4 4 0 110 8 4 4 0 010-8m0 2a2 2 0 100 4 2 2 0 000-4" />
                </svg>
                @anabernal.moda
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/20" />
    </section>
  )
}
