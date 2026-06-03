/**
 * URL pública de un archivo en Firebase Storage. Mismo bucket que usa el
 * backoffice de Ana Bernal. No depende del SDK de Firebase: el landing sólo lee.
 */
const BUCKET = 'anabernal-atelier.firebasestorage.app'

export function publicUrl(path: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(
    path,
  )}?alt=media`
}
