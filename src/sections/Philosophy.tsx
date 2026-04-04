import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Philosophy = () => {
  const ref = useRef(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const setRefs = (element: HTMLDivElement) => {
    ref.current = element;
    inViewRef(element);
  };

  const quoteVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const attributionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.9,
        delay: 0.1,
        ease: 'easeOut',
      },
    },
  };

  const quoteMarkVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 0.15,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={setRefs}
      className="relative min-h-screen w-full bg-charcoal flex items-center justify-center px-4 py-20 md:py-0"
    >
      {/* Left decorative line */}
      <motion.div
        className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 hidden md:block"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: 'center' }}
      >
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-gold to-transparent" />
      </motion.div>

      {/* Right decorative line */}
      <motion.div
        className="absolute right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 hidden md:block"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: 'center' }}
      >
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-gold to-transparent" />
      </motion.div>

      {/* Opening quotation mark */}
      <motion.div
        className="absolute top-12 md:top-20 left-6 md:left-12"
        variants={quoteMarkVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <span className="font-accent text-9xl md:text-[180px] text-gold leading-none">
          &ldquo;
        </span>
      </motion.div>

      {/* Content container */}
      <motion.div
        className="relative z-10 max-w-4xl flex flex-col items-center gap-8 md:gap-12 text-center"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Quote text */}
        <motion.blockquote
          variants={quoteVariants}
          className="font-accent italic text-3xl md:text-5xl lg:text-6xl text-cream leading-tight tracking-tight"
        >
          Creo desde el sentir, no desde la tela.
        </motion.blockquote>

        {/* Middle decorative line */}
        <motion.div
          variants={lineVariants}
          className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-gold to-transparent"
          style={{ transformOrigin: 'center' }}
        />

        {/* Attribution */}
        <motion.p
          variants={attributionVariants}
          className="font-body text-sm md:text-base tracking-widest uppercase text-gold"
        >
          — Ana María Bernal
        </motion.p>
      </motion.div>

      {/* Closing quotation mark */}
      <motion.div
        className="absolute bottom-12 md:bottom-20 right-6 md:right-12"
        variants={quoteMarkVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <span className="font-accent text-9xl md:text-[180px] text-gold leading-none">
          &rdquo;
        </span>
      </motion.div>
    </section>
  );
};

export default Philosophy;
