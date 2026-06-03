import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionHeading from '@/components/SectionHeading'
import { usePasarela, type RunwayLook } from '@/hooks/usePasarela'
import { runwayImages } from '@/data/images'

/* Fallback estático: si aún no hay prendas curadas en el backoffice, la
   pasarela nunca queda vacía — muestra runway shots de Instagram. */
const fallbackLooks: RunwayLook[] = runwayImages.map((src, i) => ({
  id: `static-${i}`,
  name: null,
  collection: null,
  season: null,
  color: null,
  silhouette: null,
  fabric: null,
  description: null,
  imageUrl: src,
}))

function RunwayCard({
  look,
  index,
  onOpen,
}: {
  look: RunwayLook
  index: number
  onOpen: (look: RunwayLook) => void
}) {
  const eyebrow = look.collection ?? look.season ?? null
  const accent = [look.silhouette, look.color].filter(Boolean).join(' · ')

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(look)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8 }}
      className="group snap-start shrink-0 w-[78vw] sm:w-[56vw] md:w-[40vw] lg:w-[30vw] xl:w-[24vw] text-left"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-graphite transition-all duration-300 group-hover:border-gold group-hover:shadow-[0_0_30px_rgba(197,162,88,0.15)]">
        {look.imageUrl ? (
          <img
            src={look.imageUrl}
            alt={look.name ?? 'Look de pasarela'}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-charcoal text-gold/40 font-accent italic">
            Ana Bernal
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Numeric runway index */}
        <span className="absolute top-4 left-4 font-heading text-sm text-gold/80 tracking-[0.2em]">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          {eyebrow && (
            <span className="block text-[10px] md:text-xs font-body tracking-[0.3em] uppercase text-gold mb-2">
              {eyebrow}
            </span>
          )}
          {look.name && (
            <h3 className="font-heading text-xl md:text-2xl font-bold text-cream tracking-tight leading-tight">
              {look.name}
            </h3>
          )}
          {accent && (
            <p className="mt-1 font-accent italic text-sm text-cream/70">{accent}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-body tracking-wider text-gold/0 group-hover:text-gold/90 transition-colors duration-300">
            Ver pieza
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  )
}

function LookModal({ look, onClose }: { look: RunwayLook; onClose: () => void }) {
  const meta = [
    ['Colección', look.collection],
    ['Temporada', look.season],
    ['Silueta', look.silhouette],
    ['Color', look.color],
    ['Tela', look.fabric],
  ].filter(([, v]) => !!v) as [string, string][]

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative z-10 flex flex-col lg:flex-row w-[95vw] max-w-5xl max-h-[90vh] rounded-xl overflow-hidden border border-gold/20 bg-black/95"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-gold/30 text-cream hover:bg-gold hover:text-black transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative flex-1 min-h-[50vh] lg:min-h-0 bg-black flex items-center justify-center">
          {look.imageUrl ? (
            <img
              src={look.imageUrl}
              alt={look.name ?? 'Look de pasarela'}
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>

        <div className="lg:w-80 xl:w-96 flex flex-col p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-gold/10 overflow-y-auto">
          {look.collection && (
            <span className="text-xs font-body tracking-[0.3em] uppercase text-gold mb-3">
              {look.collection}
            </span>
          )}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream tracking-tight leading-none mb-5">
            {look.name ?? 'Pieza de pasarela'}
          </h2>
          <div className="w-12 h-px bg-gold mb-5" />
          {look.description && (
            <p className="font-body text-sm md:text-base text-cream/80 leading-relaxed mb-6">
              {look.description}
            </p>
          )}
          {meta.length > 0 && (
            <dl className="flex flex-col gap-3">
              {meta.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-gold/10 pb-2">
                  <dt className="text-[11px] font-body tracking-[0.2em] uppercase text-cream/50">
                    {k}
                  </dt>
                  <dd className="font-accent italic text-cream text-right">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

const Pasarela = () => {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const { looks, loading } = usePasarela()
  const [active, setActive] = useState<RunwayLook | null>(null)

  const data = looks.length > 0 ? looks : fallbackLooks

  return (
    <section ref={inViewRef} id="pasarela" className="section-padding bg-black relative w-full">
      <div className="mb-14 md:mb-20">
        <SectionHeading
          title="Pasarela"
          subtitle="La colección en movimiento"
          align="center"
        />
      </div>

      {loading ? (
        <div className="flex gap-5 md:gap-6 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[78vw] sm:w-[56vw] md:w-[40vw] lg:w-[30vw] xl:w-[24vw] aspect-[3/4] rounded-lg border border-graphite bg-gradient-to-r from-charcoal via-graphite to-charcoal animate-shimmer"
              style={{ backgroundSize: '200% auto' }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {data.map((look, i) => (
            <RunwayCard key={look.id} look={look} index={i} onOpen={setActive} />
          ))}
        </motion.div>
      )}

      {/* Hint + accent line */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <span className="text-[11px] font-body tracking-[0.25em] uppercase text-cream/40">
          {data.length} {data.length === 1 ? 'pieza' : 'piezas'}
        </span>
        <span className="text-[11px] font-body tracking-[0.25em] uppercase text-gold/60 flex items-center gap-2">
          Deslizá
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7-7 7M3 12h18" />
          </svg>
        </span>
      </div>

      <motion.div
        className="mt-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ transformOrigin: 'center' }}
      />

      <AnimatePresence>
        {active && <LookModal look={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}

export default Pasarela
