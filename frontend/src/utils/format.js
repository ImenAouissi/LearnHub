export const ROLE_LABELS = { etudiant: 'Étudiant', formateur: 'Formateur', admin: 'Administrateur' };

// Une couleur de dégradé stable pour chaque catégorie
const GRADIENTS = [
  ['#6366f1', '#8b5cf6'],
  ['#0ea5e9', '#6366f1'],
  ['#10b981', '#0ea5e9'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
  ['#14b8a6', '#22c55e'],
];

export function gradientFor(text = '') {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) % 1000;
  const [a, b] = GRADIENTS[hash % GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
}

export function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}
