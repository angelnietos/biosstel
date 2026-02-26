export type ObjectiveType = 'terminal' | 'family' | 'product';

export function getObjectiveTypeFromTitle(title: string | undefined | null): ObjectiveType {
  if (!title || typeof title !== 'string') return 'terminal';
  const t = title.toLowerCase();
  if (t.includes('producto')) return 'product';
  if (t.includes('terminales')) return 'terminal';
  if (t.includes('familia')) return 'family';
  return 'terminal';
}

export const OBJECTIVE_TYPE_LINKS: Record<ObjectiveType, { href: string; label: string }> = {
  terminal: { href: '/objetivos-terminales', label: 'Ver Objetivos Terminales' },
  family:   { href: '/objetivos/familia',   label: 'Ver Objetivos Familia' },
  product:  { href: '/objetivos/producto',  label: 'Ver Objetivos Producto' },
};
