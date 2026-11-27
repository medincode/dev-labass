import { motion, type HTMLMotionProps } from 'framer-motion'

const urls = import.meta.glob('../assets/3d/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
export const ico = (n: string) => urls[`../assets/3d/${n}.webp`]

type P = { name: string; size?: number; float?: boolean; delay?: number } & Omit<HTMLMotionProps<'img'>, 'src'>
/** Icône 3D générée par imagegen. `float` = lévitation douce en boucle. */
export default function Icon3D({ name, size = 48, float, delay = 0, style, ...rest }: P) {
  return (
    <motion.img
      src={ico(name)} alt="" width={size} height={size} draggable={false} loading="lazy" decoding="async"
      style={{ width: size, height: size, objectFit: 'contain', ...style }}
      animate={float ? { y: [0, -7, 0], rotate: [-2, 2, -2] } : undefined}
      transition={float ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay } : undefined}
      {...rest}
    />
  )
}
