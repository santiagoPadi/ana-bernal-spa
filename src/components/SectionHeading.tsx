import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeading = ({
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const setRefs = (element: HTMLDivElement | null) => {
    if (element) {
      ref.current = element;
      inViewRef(element);
    }
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  const linePositionClasses = {
    left: 'ml-0',
    center: 'mx-auto',
  };

  return (
    <motion.div
      ref={setRefs}
      className={`flex flex-col gap-6 ${alignmentClasses[align]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Title */}
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-cream"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
      >
        {title}
      </motion.h2>

      {/* Gold decorative line */}
      <motion.div
        className={`h-1 w-16 bg-gradient-to-r from-gold to-gold-light rounded-full ${linePositionClasses[align]}`}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94] as any,
        }}
        style={{ transformOrigin: align === 'left' ? 'left' : 'center' }}
      />

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="text-lg md:text-xl font-light font-accent italic text-cream-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
