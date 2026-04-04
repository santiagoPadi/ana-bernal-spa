import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '@/components/SectionHeading';

/* ─── Data ─── */
const LAUNCH_DATE = new Date('2026-05-15T20:00:00-05:00'); // May 15, 2026 8PM Bogotá

const pokerCards = [
  { src: '/images/upcoming/card-ace-hearts.jpg', label: 'Ace of Hearts' },
  { src: '/images/upcoming/card-3-clubs.jpg', label: '3 of Clubs' },
  { src: '/images/upcoming/card-7-spades.jpg', label: '7 of Spades' },
  { src: '/images/upcoming/card-5-hearts.jpg', label: '5 of Hearts' },
  { src: '/images/upcoming/card-9-diamonds.jpg', label: '9 of Diamonds' },
];

const sketchPages = [
  '/images/upcoming/design-1.jpg',
  '/images/upcoming/design-2.jpg',
  '/images/upcoming/design-3.jpg',
];

/* ─── Countdown Hook ─── */
function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { days, hours, minutes, seconds };
}

/* ─── Countdown Digit ─── */
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-20 md:h-24 flex items-center justify-center rounded-lg border border-gold/30 bg-black/60 backdrop-blur-sm overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className="font-heading text-3xl md:text-4xl font-bold text-gold"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
      </div>
      <span className="mt-2 text-[10px] md:text-xs font-body tracking-[0.25em] uppercase text-cream/50">
        {label}
      </span>
    </div>
  );
}

/* ─── Card Fan Component ─── */
function CardFan() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <>
      <div className="relative flex items-end justify-center h-[420px] md:h-[500px]">
        {pokerCards.map((card, i) => {
          const total = pokerCards.length;
          const mid = (total - 1) / 2;
          const angle = (i - mid) * 8;
          const xOffset = (i - mid) * 60;
          const yOffset = Math.abs(i - mid) * 15;
          const isHovered = hoveredIndex === i;

          return (
            <motion.div
              key={card.label}
              className="absolute cursor-pointer"
              style={{
                zIndex: isHovered ? 20 : total - Math.abs(i - Math.floor(mid)),
              }}
              initial={{ opacity: 0, y: 100, rotate: angle }}
              animate={{
                opacity: 1,
                y: isHovered ? -yOffset - 40 : -yOffset,
                x: xOffset,
                rotate: isHovered ? 0 : angle,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setSelectedCard(i)}
            >
              <div className="w-48 md:w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-gold/20 hover:border-gold/50 transition-colors">
                <img
                  src={card.src}
                  alt={card.label}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Card lightbox */}
      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedCard(null)}
            />
            <motion.div
              className="relative z-10 max-w-sm mx-4"
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <img
                src={pokerCards[selectedCard].src}
                alt={pokerCards[selectedCard].label}
                className="w-full rounded-xl shadow-2xl border border-gold/30"
              />
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black border border-gold/40 text-cream hover:bg-gold hover:text-black transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Sketch Gallery ─── */
function SketchGallery() {
  const [activeSketch, setActiveSketch] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSketch((prev) => (prev + 1) % sketchPages.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative">
      {/* Sketch display */}
      <div className="relative aspect-[3/4] max-w-md mx-auto rounded-lg overflow-hidden border border-gold/20 bg-cream/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSketch}
            src={sketchPages[activeSketch]}
            alt={`Collection sketches ${activeSketch + 1}`}
            className="absolute inset-0 w-full h-full object-contain bg-white/95"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        {/* Sketch overlay label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="font-accent italic text-cream/80 text-sm">
            Sketch {activeSketch + 1} of {sketchPages.length}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {sketchPages.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSketch(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeSketch ? 'bg-gold scale-125 w-6' : 'bg-cream/20 hover:bg-cream/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function Upcoming() {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const countdown = useCountdown(LAUNCH_DATE);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="upcoming"
      className="relative bg-black overflow-hidden py-20 md:py-28 lg:py-36"
    >
      {/* Subtle cherry red accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#8B1A2B]/8 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col items-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 border border-[#C41E3A]/40 rounded-full text-xs font-body tracking-[0.3em] uppercase text-[#C41E3A] mb-6">
              Coming May 2026
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12 md:mb-16">
            <SectionHeading
              title="New Collection"
              subtitle="A new game begins. Are you ready to play?"
              align="center"
            />
          </motion.div>

          {/* Countdown */}
          <motion.div
            variants={itemVariants}
            className="flex gap-4 md:gap-6 mb-16 md:mb-20"
          >
            <CountdownUnit value={countdown.days} label="Days" />
            <div className="flex items-center text-gold/40 text-2xl font-light mt-[-20px]">:</div>
            <CountdownUnit value={countdown.hours} label="Hours" />
            <div className="flex items-center text-gold/40 text-2xl font-light mt-[-20px]">:</div>
            <CountdownUnit value={countdown.minutes} label="Min" />
            <div className="flex items-center text-gold/40 text-2xl font-light mt-[-20px]">:</div>
            <CountdownUnit value={countdown.seconds} label="Sec" />
          </motion.div>

          {/* Poker Cards Fan */}
          <motion.div variants={itemVariants} className="w-full mb-20 md:mb-28">
            <CardFan />
          </motion.div>

          {/* Two-column: Description + Sketches */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full"
          >
            {/* Left - Description */}
            <div className="flex flex-col gap-6">
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-cream tracking-tight">
                The Cards Are on the Table
              </h3>

              <div className="w-12 h-px bg-gold" />

              <p className="font-body text-cream/70 leading-relaxed">
                Inspired by the art of the game — chance, strategy, and allure — this collection transforms the poker table into a runway. Each piece is a card in a hand that's been carefully dealt: bold plays, hidden aces, and the confidence to go all in.
              </p>

              <p className="font-body text-cream/70 leading-relaxed">
                From embellished bustiers to architectural silhouettes, 17 original designs blend Ana Bernal's signature craftsmanship with the drama and mystique of a high-stakes game. Hearts, clubs, diamonds, and spades become the language of fashion.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {['Poker', 'Runway', 'Mayo 2026', '17 Designs', 'Bogotá'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-4 py-1.5 border border-gold/30 rounded-full text-xs font-body text-cream/60 hover:border-gold hover:text-gold transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <motion.a
                href="https://instagram.com/anabernal.moda"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 self-start px-8 py-4 border-2 border-gold font-body text-sm tracking-wider uppercase text-cream transition-all duration-500 hover:bg-gold hover:text-black"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.3 2c-2.1 0-3.5 1.4-3.5 3.5v8.5c0 2.1 1.4 3.5 3.5 3.5h8.5c2.1 0 3.5-1.4 3.5-3.5V7.5c0-2.1-1.4-3.5-3.5-3.5H7.5m9.3 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3m-5 1a4 4 0 110 8 4 4 0 010-8m0 2a2 2 0 100 4 2 2 0 000-4" />
                </svg>
                Stay Tuned
              </motion.a>
            </div>

            {/* Right - Sketch Gallery */}
            <SketchGallery />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </section>
  );
}
