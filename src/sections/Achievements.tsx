import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionHeading from '@/components/SectionHeading'

interface Achievement {
  year: string
  title: string
  description: string
  index: number
}

const achievements: Achievement[] = [
  {
    year: '2021',
    title: 'WorldSkills Colombia Gold Medal',
    description:
      'Fashion Technology category, representing Distrito Capital. First step towards international recognition.',
    index: 0,
  },
  {
    year: '2021',
    title: 'WorldSkills International',
    description:
      'Selected to represent Colombia on the world stage, competing against the finest young fashion talents globally.',
    index: 1,
  },
  {
    year: '2024',
    title: 'Miss Teen Universe Bogotá',
    description:
      'Official designer for contestant Mapis Chamorro, creating the GENÈSE collection for the international pageant.',
    index: 2,
  },
  {
    year: '2025',
    title: 'Colombia Se Viste de Moda',
    description:
      "Featured designer at the 7th edition of Colombia's premier fashion showcase.",
    index: 3,
  },
  {
    year: '2025',
    title: 'Gala Dorada',
    description:
      'Closing the runway with OBSESSION and GOLD ERA collections, cementing her position in Colombian haute couture.',
    index: 4,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const timelineItemVariants = {
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

export default function Achievements() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative bg-black py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <SectionHeading
            title="Achievements"
            subtitle="A journey of excellence"
            align="center"
          />
        </div>

        {/* Timeline Container */}
        <div ref={contentRef} className="relative">
          {/* Vertical Timeline Line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold to-gold-dark"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Achievements List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-12 md:space-y-16"
          >
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.index}
                variants={timelineItemVariants}
                custom={achievement.index}
                className={`flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-12 ${
                  achievement.index % 2 === 0
                    ? 'md:text-right'
                    : 'md:flex-row-reverse md:text-left'
                }`}
              >
                {/* Content - Left/Right (alternates) */}
                <div className="flex flex-1 flex-col md:gap-2">
                  {/* Year - on mobile, appears above description */}
                  <motion.div
                    variants={itemVariants}
                    className="md:hidden mb-2"
                  >
                    <h3 className="font-heading text-3xl font-light text-gold">
                      {achievement.year}
                    </h3>
                  </motion.div>

                  {/* Title */}
                  <motion.div variants={itemVariants}>
                    <h3 className="font-heading text-xl font-light leading-tight text-cream md:text-2xl">
                      {achievement.title}
                    </h3>
                  </motion.div>

                  {/* Description */}
                  <motion.div variants={itemVariants}>
                    <p className="font-body text-sm leading-relaxed text-cream-muted md:text-base">
                      {achievement.description}
                    </p>
                  </motion.div>
                </div>

                {/* Timeline Dot - Center (hidden on mobile) */}
                <motion.div
                  className="hidden relative md:flex md:flex-col md:items-center md:justify-center"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: achievement.index * 0.1 + 0.3,
                  }}
                >
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-gold" />
                    <div className="absolute inset-0 rounded-full border border-gold/30 animate-pulse" />
                  </div>
                </motion.div>

                {/* Year - Desktop (hidden on mobile) */}
                <motion.div variants={itemVariants} className="hidden flex-1 md:flex">
                  <h3 className="font-heading text-3xl font-light text-gold md:text-4xl">
                    {achievement.year}
                  </h3>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/20" />
    </section>
  )
}
