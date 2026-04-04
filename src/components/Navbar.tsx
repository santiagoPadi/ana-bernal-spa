import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Collections', id: 'collections' },
    { name: 'Upcoming', id: 'upcoming' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0, x: -100 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const hamburgerVariants = {
    top: {
      closed: { rotate: 0, y: 0 },
      open: { rotate: 45, y: 10 },
    },
    middle: {
      closed: { opacity: 1 },
      open: { opacity: 0 },
    },
    bottom: {
      closed: { rotate: 0, y: 0 },
      open: { rotate: -45, y: -10 },
    },
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-gold/10'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/images/logo-be-gold.png"
                alt="Ana Bernal"
                className="h-10 md:h-12 w-auto"
              />
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="px-4 py-2 text-cream hover:text-gold transition-colors duration-300 font-light tracking-wide text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Mobile Hamburger Menu */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 relative w-8 h-6 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              className="w-full h-0.5 bg-gold rounded-full origin-center"
              variants={hamburgerVariants.top}
              animate={isOpen ? 'open' : 'closed'}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-full h-0.5 bg-gold rounded-full origin-center"
              variants={hamburgerVariants.middle}
              animate={isOpen ? 'open' : 'closed'}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-full h-0.5 bg-gold rounded-full origin-center"
              variants={hamburgerVariants.bottom}
              animate={isOpen ? 'open' : 'closed'}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="fixed left-0 top-16 w-full bg-black/95 backdrop-blur-xl border-b border-gold/20 z-30 md:hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col py-6 px-6 gap-4">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-left text-cream hover:text-gold transition-colors duration-300 font-light tracking-wide py-2 border-b border-gold/10 last:border-b-0"
                    variants={itemVariants}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
