import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api'
import StatCard from '../components/ui/StatCard'
import { StockBadge } from '../components/ui/Badges'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getProducts()
      .then(r => setProducts(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  const total   = products.length
  const outList = products.filter(p => p.quantity === 0)
  const lowList = products.filter(p => p.quantity > 0 && p.quantity < p.minThreshold)
  const okCount = total - outList.length - lowList.length

  if (loading) return <Loader />

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Total produits"  value={total}           color="default" />
        <StatCard icon="✅" label="En stock"        value={okCount}          color="success" />
        <StatCard icon="⚠️" label="Stock faible"   value={lowList.length}   color="alert"   />
        <StatCard icon="⛔" label="En rupture"      value={outList.length}   color="danger"  />
      </div>

      {/* Alertes */}
      {(outList.length > 0 || lowList.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-lg font-display text-coffee-dark">🚨 Produits à commander</h2>

          {outList.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Rupture de stock</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {outList.map(p => <AlertProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}

          {lowList.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Stock faible</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowList.map(p => <AlertProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}

          <Link to="/purchases" id="btn-generate-purchase"
            className="btn-primary inline-flex mt-2">
            🛒 Générer la liste d'achat
          </Link>
        </div>
      )}

      {/* Tous les produits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display text-coffee-dark">Tous les produits</h2>
          <Link to="/products" className="btn-secondary btn-sm">Gérer →</Link>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Seuil min.</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-coffee-pale">Aucun produit</td></tr>
              )}
              {products.map(p => (
                <tr key={p._id}>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-coffee-light">{p.category}</td>
                  <td className="font-semibold">{p.quantity} <span className="text-coffee-pale text-xs">{p.unit}</span></td>
                  <td className="text-coffee-light">{p.minThreshold} {p.unit}</td>
                  <td><StockBadge status={p.stockStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AlertProductCard({ product }) {
  const isOut = product.quantity === 0
  const needed = Math.max(0, product.minThreshold - product.quantity)
  return (
    <div className={isOut ? 'alert-card-out' : 'alert-card-low'}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm text-coffee-dark">{product.name}</p>
          <p className="text-xs text-coffee-light mt-0.5">{product.category}</p>
        </div>
        <StockBadge status={product.stockStatus} />
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span className="text-coffee-light">Stock : <strong className="text-coffee-dark">{product.quantity} {product.unit}</strong></span>
        <span className="text-coffee-light">À acheter : <strong className={isOut ? 'text-red-600' : 'text-amber-700'}>{needed} {product.unit}</strong></span>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-coffee-light text-center space-y-2">
        <p className="text-3xl animate-spin inline-block">☕</p>
        <p className="text-sm">Chargement...</p>
      </div>
    </div>
  )
}
