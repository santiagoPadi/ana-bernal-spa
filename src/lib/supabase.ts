import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase de SÓLO LECTURA (anon) contra el proyecto de Ana Bernal
 * (ana-bernal-atelier). Lee la vista `public_runway` que expone las prendas
 * curadas en la pasarela pública desde el backoffice. La seguridad recae en
 * RLS: el anon key sólo ve lo que las policies permiten.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null

export const hasSupabase = supabase !== null
