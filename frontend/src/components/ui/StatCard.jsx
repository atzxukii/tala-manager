export default function StatCard({ icon, label, value, sub, color = 'default' }) {
  const colorMap = {
    default: 'bg-white border-coffee/10',
    alert:   'bg-alert-low border-alert-lowBorder/40',
    danger:  'bg-alert-out border-alert-outBorder/40',
    success: 'bg-green-50 border-green-200',
  }

  const valueColorMap = {
    default: 'text-coffee-dark',
    alert:   'text-amber-700',
    danger:  'text-red-600',
    success: 'text-green-700',
  }

  return (
    <div className={`card border ${colorMap[color]} flex items-center gap-4`}>
      <div className="text-4xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-coffee-light uppercase tracking-wider truncate">{label}</p>
        <p className={`text-3xl font-bold mt-0.5 ${valueColorMap[color]}`}>{value}</p>
        {sub && <p className="text-xs text-coffee-pale mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
