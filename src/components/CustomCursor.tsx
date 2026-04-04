import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
  });
  const [ringPosition, setRingPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
  });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Check if device has coarse pointer (touch)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Update main cursor position immediately
      setCursorPosition({ x: clientX, y: clientY });

      // Update ring position with delay for smooth trailing effect
      setTimeout(() => {
        setRingPosition({ x: clientX, y: clientY });
      }, 50);

      // Check if hovering over interactive elements
      const target = document.elementFromPoint(clientX, clientY);
      const isInteractive =
        target?.tagName === 'A' ||
        target?.tagName === 'BUTTON' ||
        target?.getAttribute('role') === 'button';
      setIsPointer(isInteractive);
    };

    const handleMouseLeave = () => {
      setCursorPosition({ x: -100, y: -100 });
      setRingPosition({ x: -100, y: -100 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          x: -6,
          y: -6,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #C5A258, #D4B76A)',
            boxShadow: '0 0 8px rgba(197, 162, 88, 0.6)',
          }}
        />
      </motion.div>

      {/* Ring cursor with trail */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          left: ringPosition.x,
          top: ringPosition.y,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          x: -12,
          y: -12,
        }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 transition-colors duration-200"
          style={{
            borderColor: isPointer ? '#D4B76A' : '#C5A258',
            boxShadow: `0 0 12px ${isPointer ? 'rgba(212, 183, 106, 0.4)' : 'rgba(197, 162, 88, 0.3)'}`,
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
