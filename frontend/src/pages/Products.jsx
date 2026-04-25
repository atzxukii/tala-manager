import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api'
import Modal from '../components/ui/Modal'
import ProductForm from '../components/forms/ProductForm'
import { StockBadge } from '../components/ui/Badges'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving,  setSaving]    = useState(false)
  const [search,  setSearch]    = useState('')
  const [modal,   setModal]     = useState(null) // 'add' | { product }

  const load = () => {
    setLoading(true)
    getProducts()
      .then(r => setProducts(r.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      if (modal === 'add') {
        await createProduct(data)
        toast.success('Produit ajouté !')
      } else {
        await updateProduct(modal.product._id, data)
        toast.success('Produit modifié !')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return
    try {
      await deleteProduct(id)
      toast.success('Produit supprimé')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="page-header">
        <h1 className="page-title">📦 Produits</h1>
        <button id="btn-add-product" className="btn-primary" onClick={() => setModal('add')}>
          + Ajouter un produit
        </button>
      </div>

      {/* Recherche */}
      <div className="relative max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-pale">🔍</span>
        <input
          id="search-products"
          className="input pl-9"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tableau */}
      {loading ? (
        <p className="text-coffee-pale text-center py-10">Chargement...</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Seuil min.</th>
                <th>Prix (U)</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-coffee-pale">Aucun produit trouvé</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p._id}>
                  <td className="font-medium text-coffee-dark">{p.name}</td>
                  <td>
                    <span className="px-2 py-0.5 bg-cream-dark text-coffee text-xs rounded-full">{p.category}</span>
                  </td>
                  <td className="font-semibold">{p.quantity} <span className="text-xs text-coffee-pale">{p.unit}</span></td>
                  <td className="text-coffee-light">{p.minThreshold} {p.unit}</td>
                  <td className="font-medium text-coffee-dark">{p.price ? `${p.price.toFixed(2)} DA` : '0.00 DA'}</td>
                  <td><StockBadge status={p.stockStatus} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        id={`edit-product-${p._id}`}
                        className="btn-secondary btn-sm"
                        onClick={() => setModal({ product: p })}
                      >✏️</button>
                      <button
                        id={`delete-product-${p._id}`}
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(p._id, p.name)}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal ajout / modif */}
      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'add' ? '+ Nouveau produit' : `✏️ Modifier — ${modal?.product?.name}`}
      >
        <ProductForm
          initial={modal?.product}
          onSubmit={handleSubmit}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>
    </div>
  )
}
