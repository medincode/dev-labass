import { motion } from 'framer-motion'

/** Titre de section : texte seul, Fredoka fine et claire (plus de logo image). */
export default function TitleLogo({ alt }: { name?: string; alt: string }) {
  return (
    <motion.h1 className="page-title" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      {alt}
    </motion.h1>
  )
}
