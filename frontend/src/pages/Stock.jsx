import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getProducts, addStock, removeStock } from '../api'
import Modal from '../components/ui/Modal'
import StockForm from '../components/forms/StockForm'
import { StockBadge } from '../components/ui/Badges'

export default function Stock() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [modal,    setModal]    = useState(null) // 'entry' | 'exit'

  const load = () => {
    setLoading(true)
    getProducts()
      .then(r => setProducts(r.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStock = async (data) => {
    setSaving(true)
    try {
      if (modal === 'entry') {
        await addStock(data)
        toast.success('Stock ajouté ✅')
      } else {
        await removeStock(data)
        toast.success('Stock retiré ✅')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="page-header">
        <h1 className="page-title">🔄 Gestion des Stocks</h1>
        <div className="flex gap-2">
          <button id="btn-stock-entry" className="btn-success" onClick={() => setModal('entry')}>
            ↑ Entrée stock
          </button>
          <button id="btn-stock-exit" className="btn-danger" onClick={() => setModal('exit')}>
            ↓ Sortie stock
          </button>
        </div>
      </div>

      {/* Vue rapide des stocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="col-span-3 text-center py-10 text-coffee-pale">Chargement...</p>}
        {products.map(p => (
          <div key={p._id} className={`card-hover flex items-center gap-4
            ${p.stockStatus === 'out' ? 'border-l-4 border-red-400' :
              p.stockStatus === 'low' ? 'border-l-4 border-amber-400' :
              'border-l-4 border-green-300'}`}>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-coffee-dark truncate">{p.name}</p>
              <p className="text-xs text-coffee-light">{p.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-coffee">{p.quantity}</span>
                <span className="text-xs text-coffee-pale">{p.unit}</span>
                <span className="text-xs text-coffee-pale">/ min {p.minThreshold}</span>
              </div>
            </div>
            <StockBadge status={p.stockStatus} />
          </div>
        ))}
      </div>

      {/* Modal entrée */}
      <Modal
        isOpen={modal === 'entry'}
        onClose={() => setModal(null)}
        title="↑ Entrée de stock"
      >
        <StockForm
          products={products}
          type="entry"
          onSubmit={handleStock}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>

      {/* Modal sortie */}
      <Modal
        isOpen={modal === 'exit'}
        onClose={() => setModal(null)}
        title="↓ Sortie de stock"
      >
        <StockForm
          products={products}
          type="exit"
          onSubmit={handleStock}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>
    </div>
  )
}
