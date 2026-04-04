import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '@/components/SectionHeading';
import { collections as collectionImages } from '@/data/images';

interface Collection {
  id: string;
  name: string;
  description: string;
  year: number;
  tags: string[];
  image: string;
  images: string[];
}

const AUTOPLAY_INTERVAL = 3000;

/* ─── Modal Component ─── */
function CollectionModal({
  collection,
  onClose,
}: {
  collection: Collection;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + collection.images.length) % collection.images.length);
    },
    [collection.images.length]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, next, prev]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 flex flex-col lg:flex-row w-[95vw] max-w-6xl max-h-[90vh] rounded-xl overflow-hidden border border-gold/20 bg-black/95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-gold/30 text-cream hover:bg-gold hover:text-black transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Carousel area */}
        <div
          className="relative flex-1 min-h-[50vh] lg:min-h-0 bg-black flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={collection.images[currentIndex]}
              src={collection.images[currentIndex]}
              alt={`${collection.name} — ${currentIndex + 1} of ${collection.images.length}`}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-gold/30 text-cream hover:bg-gold hover:text-black transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-gold/30 text-cream hover:bg-gold hover:text-black transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <motion.div
              className="h-full bg-gold"
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? undefined : '100%' }}
              transition={{
                duration: AUTOPLAY_INTERVAL / 1000,
                ease: 'linear',
              }}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 xl:w-96 flex flex-col p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-gold/10 overflow-y-auto">
          {/* Year */}
          <span className="text-xs font-body tracking-[0.3em] uppercase text-gold mb-3">
            {collection.year}
          </span>

          {/* Name */}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream tracking-tight leading-none mb-5">
            {collection.name}
          </h2>

          {/* Gold divider */}
          <div className="w-12 h-px bg-gold mb-5" />

          {/* Description */}
          <p className="font-body text-sm md:text-base text-cream/80 leading-relaxed mb-6">
            {collection.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {collection.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 border border-gold/40 rounded-full text-xs font-body text-gold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Image counter */}
          <div className="mt-auto flex items-center justify-between">
            <span className="font-body text-xs text-cream/50 tracking-wider">
              {currentIndex + 1} / {collection.images.length} designs
            </span>

            {/* Dot indicators */}
            <div className="flex gap-1.5">
              {collection.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'bg-gold scale-125'
                      : 'bg-cream/20 hover:bg-cream/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ─── */
const Collections = () => {
  const ref = useRef(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  const setRefs = (element: HTMLDivElement) => {
    ref.current = element;
    inViewRef(element);
  };

  const collections: Collection[] = [
    {
      id: 'obsession',
      name: 'OBSESSION',
      description:
        'Power meets precision. Structured silhouettes with pearl degradé details that command attention. Presented on the runway in 2025, this collection embodies the relentless pursuit of perfection — every stitch, every drape, meticulously crafted to make a bold statement.',
      year: 2025,
      tags: ['Runway', 'Haute Couture'],
      image: collectionImages.obsession[0],
      images: collectionImages.obsession,
    },
    {
      id: 'genesis',
      name: 'GENÈSE',
      description:
        'Born for the spotlight. Designed for Miss Teen Universe Bogotá 2024, a collection that marks the genesis of bold elegance. Each piece celebrates youth, confidence, and the transformative power of fashion on the international stage.',
      year: 2024,
      tags: ['Competition', 'Pageant'],
      image: collectionImages.genese[0],
      images: collectionImages.genese,
    },
    {
      id: 'gold-era',
      name: 'GOLD ERA',
      description:
        'An ode to opulence. Golden tones meet architectural cuts in a celebration of Colombian craftsmanship. This collection draws from the richness of Latin American heritage, fusing modern silhouettes with timeless luxury.',
      year: 2024,
      tags: ['Runway', 'Gold Collection'],
      image: collectionImages.goldEra[0],
      images: collectionImages.goldEra,
    },
    {
      id: 'fontana-h',
      name: 'FONTANA H',
      description:
        'Where classic meets contemporary. Refined silhouettes with a modern Colombian identity. Fontana H pays homage to the art of tailoring with fluid lines and understated elegance that speaks volumes.',
      year: 2023,
      tags: ['Ready-to-Wear', 'Editorial'],
      image: collectionImages.fontanaH[0],
      images: collectionImages.fontanaH,
    },
    {
      id: 'circus-era',
      name: 'CIRCUS ERA',
      description:
        'The collection that started it all. Bold, theatrical, and unapologetically creative. Circus Era captures the energy of spectacle and transforms it into wearable art — a fearless debut that announced a new voice in Colombian fashion.',
      year: 2022,
      tags: ['Debut', 'Theatrical'],
      image: collectionImages.circusEra[0],
      images: collectionImages.circusEra,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={setRefs}
      id="collections"
      className="section-padding bg-black relative w-full"
    >
      {/* Section Heading */}
      <div className="mb-16 md:mb-20 lg:mb-24">
        <SectionHeading
          title="Collections"
          subtitle="Defining a new era of Colombian fashion"
          align="center"
        />
      </div>

      {/* Collections Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            variants={cardVariants}
            whileHover="hover"
            className={`relative group cursor-pointer ${
              index === 0 ? 'lg:col-span-3' : ''
            }`}
            onClick={() => setActiveCollection(collection)}
          >
            {/* Full-image card with overlay */}
            <motion.div
              variants={cardHoverVariants}
              className={`relative overflow-hidden rounded-lg border border-graphite transition-all duration-300 group-hover:border-gold group-hover:shadow-[0_0_30px_rgba(197,162,88,0.15)] ${
                index === 0 ? 'aspect-[4/5] md:aspect-[3/2]' : 'aspect-[4/5]'
              }`}
            >
              {/* Full bleed image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content overlay at bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                {/* Year */}
                <span className="text-xs md:text-sm font-body tracking-[0.3em] uppercase text-gold mb-2">
                  {collection.year}
                </span>

                {/* Collection Name */}
                <h3
                  className={`font-heading font-bold text-cream tracking-tight leading-none mb-3 ${
                    index === 0
                      ? 'text-4xl md:text-5xl lg:text-6xl'
                      : 'text-2xl md:text-3xl'
                  }`}
                >
                  {collection.name}
                </h3>

                {/* Description */}
                <p
                  className={`font-body text-cream/80 leading-relaxed mb-4 ${
                    index === 0
                      ? 'text-sm md:text-base max-w-2xl'
                      : 'text-xs md:text-sm'
                  }`}
                >
                  {collection.description.split('.').slice(0, 2).join('.') + '.'}
                </p>

                {/* Tags + View CTA */}
                <div className="flex flex-wrap items-center gap-2">
                  {collection.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 border border-cream/30 rounded-full text-xs font-body text-cream/70 backdrop-blur-sm bg-black/20"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-xs font-body tracking-wider text-gold/80 group-hover:text-gold transition-colors flex items-center gap-1">
                    View {collection.images.length} designs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-16 md:mt-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ transformOrigin: 'center' }}
      />

      {/* Collection Modal */}
      <AnimatePresence>
        {activeCollection && (
          <CollectionModal
            collection={activeCollection}
            onClose={() => setActiveCollection(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Collections;
