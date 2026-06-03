import { useEffect, useState } from 'react'
import { supabase, hasSupabase } from '@/lib/supabase'
import { publicUrl } from '@/lib/firebaseStorage'

export interface RunwayLook {
  id: string
  name: string | null
  collection: string | null
  season: string | null
  color: string | null
  silhouette: string | null
  fabric: string | null
  description: string | null
  /** URL pública resuelta de la imagen principal (Firebase). */
  imageUrl: string | null
}

interface RunwayRow {
  id: string | null
  name: string | null
  collection: string | null
  season: string | null
  color: string | null
  silhouette: string | null
  fabric: string | null
  description: string | null
  main_image_path: string | null
  sort_order: number | null
}

/**
 * Carga las prendas de la pasarela pública (vista public_runway) vía anon.
 * Degrada con gracia: si no hay Supabase / error / vacío, devuelve looks = []
 * para que la sección caiga al fallback estático.
 */
export function usePasarela() {
  const [looks, setLooks] = useState<RunwayLook[]>([])
  const [loading, setLoading] = useState(hasSupabase)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // loading ya arranca en `hasSupabase`; si no hay Supabase, no hay nada que cargar.
    if (!hasSupabase || !supabase) return
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('public_runway')
        .select(
          'id, name, collection, season, color, silhouette, fabric, description, main_image_path, sort_order',
        )
        .order('sort_order')
      if (cancelled) return
      if (error) {
        setError(error.message)
        setLooks([])
        setLoading(false)
        return
      }
      const rows = (data ?? []) as RunwayRow[]
      setLooks(
        rows
          .filter((r): r is RunwayRow & { id: string } => !!r.id)
          .map((r) => ({
            id: r.id,
            name: r.name,
            collection: r.collection,
            season: r.season,
            color: r.color,
            silhouette: r.silhouette,
            fabric: r.fabric,
            description: r.description,
            imageUrl: r.main_image_path ? publicUrl(r.main_image_path) : null,
          })),
      )
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { looks, loading, error }
}
