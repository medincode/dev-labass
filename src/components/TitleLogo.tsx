import { motion } from 'framer-motion'

const urls = import.meta.glob('../assets/brand/title-*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
/** Logo de section (wordmark 3D généré par imagegen). */
export default function TitleLogo({ name, alt }: { name: string; alt: string }) {
  const src = urls[`../assets/brand/title-${name}.webp`]
  if (!src) return <h1><b>{alt}</b></h1>
  return (
    <motion.img src={src} alt={alt} className="title-logo" draggable={false}
      initial={{ scale: .8, opacity: 0, rotate: -3 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      whileHover={{ scale: 1.05, rotate: -1.5 }} />
  )
}
