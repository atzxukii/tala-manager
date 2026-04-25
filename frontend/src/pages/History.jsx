import { useEffect, useState } from 'react'
import { getHistory, getProducts } from '../api'
import { MovementBadge } from '../components/ui/Badges'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function History() {
  const [movements, setMovements] = useState([])
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filters,   setFilters]   = useState({ productId: '', startDate: '', endDate: '', type: '' })

  const load = () => {
    setLoading(true)
    const params = {}
    if (filters.productId)  params.productId  = filters.productId
    if (filters.startDate)  params.startDate  = filters.startDate
    if (filters.endDate)    params.endDate    = filters.endDate
    if (filters.type)       params.type       = filters.type
    getHistory(params)
      .then(r => setMovements(r.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { getProducts().then(r => setProducts(r.data.data)) }, [])
  useEffect(() => { load() }, [filters])

  const handle = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }))
  const reset  = () => setFilters({ productId: '', startDate: '', endDate: '', type: '' })

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="page-header">
        <h1 className="page-title">📋 Historique</h1>
        <span className="badge bg-coffee-pale/20 text-coffee text-sm px-3 py-1 rounded-full">
          {movements.length} opération(s)
        </span>
      </div>

      {/* Filtres */}
      <div className="card">
        <p className="text-sm font-semibold text-coffee mb-3">🔍 Filtres</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="label" htmlFor="filter-product">Produit</label>
            <select id="filter-product" name="productId" className="input" value={filters.productId} onChange={handle}>
              <option value="">Tous</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="filter-type">Type</label>
            <select id="filter-type" name="type" className="input" value={filters.type} onChange={handle}>
              <option value="">Tous</option>
              <option value="entry">Entrée</option>
              <option value="exit">Sortie</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="filter-start">Du</label>
            <input id="filter-start" type="date" name="startDate" className="input"
              value={filters.startDate} onChange={handle} />
          </div>
          <div>
            <label className="label" htmlFor="filter-end">Au</label>
            <input id="filter-end" type="date" name="endDate" className="input"
              value={filters.endDate} onChange={handle} />
          </div>
        </div>
        <button id="filter-reset" className="btn-secondary btn-sm mt-3" onClick={reset}>
          ✖ Réinitialiser
        </button>
      </div>

      {/* Tableau */}
      {loading ? (
        <p className="text-center py-10 text-coffee-pale">Chargement...</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-coffee-pale">Aucune opération</td></tr>
              )}
              {movements.map(m => (
                <tr key={m._id}>
                  <td className="text-xs text-coffee-light whitespace-nowrap">
                    {format(new Date(m.date), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="font-medium">{m.product?.name || '—'}</td>
                  <td><MovementBadge type={m.type} /></td>
                  <td className="font-semibold">
                    {m.type === 'entry' ? '+' : '-'}{m.quantity}{' '}
                    <span className="text-xs text-coffee-pale">{m.product?.unit}</span>
                  </td>
                  <td className="text-coffee-light text-xs">{m.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
