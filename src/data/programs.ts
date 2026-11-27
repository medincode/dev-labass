// Contenu des programmes sport. Ajoute/modifie les exercices ici, l'UI suit automatiquement.
export type Exercise = { name: string; detail?: string }
export type Program = { title: string; intro?: string; exercises: Exercise[] }

const ex = (...names: string[]): Exercise[] => names.map(name => ({ name }))
const FINISH = ['Farm walk', 'Abdos', 'Lombaires']

export const PROGRAMS: Record<string, Program> = {
  gym1: { title: 'Full body V1', exercises: ex('Pecs machine', 'Hack squat', 'Épaules press', 'Deadlift dumbell', 'Dos poulie', 'Leg curl', 'Biceps poulie', 'Triceps poulie', 'Mollets machine', ...FINISH) },
  gym2: { title: 'Full body V2', exercises: ex('Pecs haltère incliné', 'Deadlift', 'Épaules machine', 'Goblet squat', 'Dos poulie', 'Lunges', 'Biceps EZ bar', 'Triceps EZ bar', 'Mollets hack squat machine', ...FINISH) },
  gym3: { title: 'Full body V3', exercises: ex('Pec flies', 'Leg press', 'Épaules poulie', 'Single leg press', 'Dos rowbar V', 'Mollets leg press', 'Biceps machine', 'Triceps machine', ...FINISH) },
  surf: { title: 'Surf', exercises: [] },
  tennis: { title: 'Tennis', exercises: [] },
  cardio: { title: 'Gym cardio', exercises: [] },
  forest: { title: 'Run forest', exercises: [] },
  beach: { title: 'Run & plouf beach', exercises: [] },
  stretch: { title: 'Stretching', exercises: [] },
  ice: { title: 'Ice bath', exercises: [] },
}

/** Carousel : une entrée par sport, la gym regroupe V1/V2/V3. */
export const GROUPS = [
  { id: 'surf', label: 'Surf', icon: 'surf', ids: ['surf'] },
  { id: 'tennis', label: 'Tennis', icon: 'tennis', ids: ['tennis'] },
  { id: 'gym', label: 'Gym', icon: 'gym1', ids: ['gym1', 'gym2', 'gym3'] },
  { id: 'cardio', label: 'Cardio', icon: 'cardio', ids: ['cardio'] },
  { id: 'forest', label: 'Run forest', icon: 'forest', ids: ['forest'] },
  { id: 'beach', label: 'Run beach', icon: 'beach', ids: ['beach'] },
  { id: 'stretch', label: 'Stretching', icon: 'stretch', ids: ['stretch'] },
  { id: 'ice', label: 'Ice bath', icon: 'ice', ids: ['ice'] },
]
