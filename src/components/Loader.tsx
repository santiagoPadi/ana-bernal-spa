import { motion } from 'framer-motion';

const Loader = () => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const dotVariants = {
    initial: { y: 0, opacity: 0.5 },
    animate: (i: number) => ({
      y: [-10, 10, -10],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        delay: i * 0.1,
      } as any,
    }),
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <motion.div
        className="flex gap-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              background:
                'linear-gradient(135deg, #C5A258, #D4B76A, #A88B3D)',
            }}
            variants={dotVariants}
            custom={i}
            initial="initial"
            animate="animate"
          />
        ))}
      </motion.div>

      {/* Pulse ring effect */}
      <motion.div
        className="absolute w-32 h-32 border border-gold/20 rounded-full"
        animate={{
          scale: [1, 1.5],
          opacity: [1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </div>
  );
};

export default Loader;
