const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
export const Arrow = () => <svg width="16" height="16" viewBox="0 0 24 24" {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
export const Back = () => <svg width="22" height="22" viewBox="0 0 24 24" {...p}><path d="M15 5l-7 7 7 7" /></svg>
export const Next = () => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M9 5l7 7-7 7" /></svg>
export const Prev = () => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M15 5l-7 7 7 7" /></svg>
