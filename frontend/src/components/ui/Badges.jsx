export function StockBadge({ status }) {
  if (status === 'out') return <span className="badge-out">⛔ Rupture</span>
  if (status === 'low') return <span className="badge-low">⚠️ Stock faible</span>
  return <span className="badge-ok">✅ OK</span>
}

export function MovementBadge({ type }) {
  if (type === 'entry') return <span className="badge-entry">↑ Entrée</span>
  return <span className="badge-exit">↓ Sortie</span>
}
