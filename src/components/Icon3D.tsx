import { motion, type HTMLMotionProps } from 'framer-motion'

const urls = import.meta.glob('../assets/3d/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
export const ico = (n: string) => urls[`../assets/3d/${n}.webp`]

type P = { name: string; size?: number; float?: boolean; delay?: number } & Omit<HTMLMotionProps<'img'>, 'src'>
/** Icône 3D générée par imagegen. `float` = lévitation douce en CSS (animation compositeur, sans JS). */
export default function Icon3D({ name, size = 48, float, delay = 0, style, className, ...rest }: P) {
  const img = (
    <motion.img src={ico(name)} alt="" width={size} height={size} draggable={false} loading="lazy" decoding="async"
      style={{ width: size, height: size, objectFit: 'contain', ...(float ? {} : style) }} className={float ? undefined : className} {...rest} />
  )
  return float
    ? <span className={'float ' + (className ?? '')} style={{ animationDelay: `${delay}s`, ...(style as React.CSSProperties) }}>{img}</span>
    : img
}
