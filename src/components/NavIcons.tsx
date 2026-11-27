const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const paths: Record<string, React.ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5" /><path d="M10 20v-5h4v5" /></>,
  fap: <><path d="M15 3l2-.8" /><path d="M15 3.2l2 .7c1 5-.5 10.4-4 13.8-2.6 2.5-6 3.4-9 2.6l-1-1.6c3.2-.6 5.6-2.4 7.3-5.2C12 10.6 13 7 12.8 4.2z" /></>,
  cheat: <><path d="M4 11c0-4 3.6-7 8-7s8 3 8 7z" /><path d="M3.5 14.2c1.2 1 2.2 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" /><path d="M4.5 17h15v1a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 18z" /></>,
  fitness: <><path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" /></>,
  meditation: <><path d="M3 9h11a3 3 0 1 0-3-3" /><path d="M3 14h15a3 3 0 1 1-3 3" /><path d="M3 19h6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  auto: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17" /><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M9 20h6M10 17h4" /></>,
  chart: <path d="M5 20V11M12 20V5M19 20v-7" />,
  heartbreak: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /><path d="M12 7.5 10.5 11l3 2-1.5 3.5" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" />,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
}
export default function NavIcon({ name, size = 26 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...P}>{paths[name]}</svg>
}
