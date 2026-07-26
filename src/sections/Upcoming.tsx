import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/* ─── Ambient floating dots (fixed positions, subtle sparkle) ─── */
const floatDots = [
  { top: '16%', left: '12%', size: 'h-1.5 w-1.5', delay: '0s' },
  { top: '26%', right: '14%', size: 'h-1 w-1', delay: '1.6s' },
  { bottom: '24%', left: '18%', size: 'h-1 w-1', delay: '0.9s' },
  { bottom: '30%', right: '20%', size: 'h-1.5 w-1.5', delay: '2.4s' },
  { top: '52%', left: '7%', size: 'h-1 w-1', delay: '1.3s' },
  { top: '60%', right: '9%', size: 'h-1.5 w-1.5', delay: '0.4s' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: 'easeOut', delay: 0.5 },
  },
};

export default function Upcoming() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      ref={sectionRef}
      id="upcoming"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black py-24 md:py-28"
    >
      {/* Ambient glows: cherry accent of the collection + soft gold */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B1A2B]/10 blur-[170px]" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute -top-24 -left-10 h-[380px] w-[380px] rounded-full bg-gold/[0.05] blur-[130px]" />

      {/* Floating gold dots */}
      {floatDots.map((d, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute rounded-full bg-gold/40 animate-float ${d.size}`}
          style={{
            top: d.top,
            bottom: d.bottom,
            left: d.left,
            right: d.right,
            animationDelay: d.delay,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col items-center gap-8"
        >
          {/* Eyebrow: gold rules + cherry diamond accents */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="block h-2 w-2 rotate-45 bg-[#C41E3A]/80" />
            <span className="font-body text-xs uppercase tracking-[0.4em] text-cream/70">
              Ana Bernal
            </span>
            <span className="block h-2 w-2 rotate-45 bg-[#C41E3A]/80" />
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
          </motion.div>

          {/* Title with slow gold shimmer */}
          <motion.h2
            variants={itemVariants}
            className="font-heading text-6xl font-light leading-[0.95] tracking-tight md:text-8xl xl:text-[9rem]"
            style={{
              background:
                'linear-gradient(120deg, #A88B3D 0%, #C5A258 22%, #FAF8F5 50%, #C5A258 78%, #A88B3D 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 6s linear infinite',
            }}
          >
            Coming Soon
          </motion.h2>

          {/* Gold divider */}
          <motion.div
            variants={lineVariants}
            style={{ transformOrigin: 'center' }}
            className="h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
          />

          {/* Poetic hook */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl font-accent text-xl italic text-cream/80 md:text-2xl"
          >
            Una nueva era está por revelarse.
          </motion.p>

          {/* Supporting line */}
          <motion.p
            variants={itemVariants}
            className="max-w-md font-body text-sm leading-relaxed text-cream/50"
          >
            Ana Bernal prepara su próxima colección — un nuevo lenguaje de moda,
            a punto de descubrirse.
          </motion.p>

          {/* CTA — standard outline-gold variant */}
          <motion.a
            variants={itemVariants}
            href="https://instagram.com/anabernal.moda"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-2 inline-block overflow-hidden rounded-none border-2 border-gold px-10 py-4 font-body text-sm uppercase tracking-wider text-cream transition-all duration-500 hover:text-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg
                className="h-5 w-5 transition-transform group-hover:rotate-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.3 2c-2.1 0-3.5 1.4-3.5 3.5v8.5c0 2.1 1.4 3.5 3.5 3.5h8.5c2.1 0 3.5-1.4 3.5-3.5V7.5c0-2.1-1.4-3.5-3.5-3.5H7.5m9.3 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3m-5 1a4 4 0 110 8 4 4 0 010-8m0 2a2 2 0 100 4 2 2 0 000-4" />
              </svg>
              Stay Tuned
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
    </section>
  );
}
