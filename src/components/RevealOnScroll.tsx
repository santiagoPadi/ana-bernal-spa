import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

const RevealOnScroll = ({
  children,
  direction = 'up',
  delay = 0,
}: RevealOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const setRefs = (element: HTMLDivElement | null) => {
    if (element) {
      ref.current = element;
      inViewRef(element);
    }
  };

  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { y: 60 };
      case 'left':
        return { x: -60 };
      case 'right':
        return { x: 60 };
      default:
        return { y: 60 };
    }
  };

  const animateState = () => {
    switch (direction) {
      case 'up':
        return { y: 0 };
      case 'left':
        return { x: 0 };
      case 'right':
        return { x: 0 };
      default:
        return { y: 0 };
    }
  };

  return (
    <motion.div
      ref={setRefs}
      initial={{
        opacity: 0,
        ...getInitialState(),
      }}
      animate={
        inView
          ? {
              opacity: 1,
              ...animateState(),
            }
          : {
              opacity: 0,
              ...getInitialState(),
            }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
      }}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
