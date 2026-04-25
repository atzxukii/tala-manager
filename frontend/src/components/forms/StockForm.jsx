import { useState } from 'react'

export default function StockForm({ products, type, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ productId: '', quantity: '', note: '' })

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, quantity: Number(form.quantity) })
  }

  const isEntry = type === 'entry'

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium mb-2
        ${isEntry ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
        {isEntry ? '↑ Ajout de stock (Entrée)' : '↓ Retrait de stock (Sortie)'}
      </div>

      <div className="form-group">
        <label className="label" htmlFor="stock-product">Produit *</label>
        <select id="stock-product" name="productId" className="input" required
          value={form.productId} onChange={handle}>
          <option value="">Sélectionner un produit...</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} — {p.quantity} {p.unit} en stock
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="stock-quantity">Quantité *</label>
        <input id="stock-quantity" name="quantity" type="number" min="1" className="input" required
          placeholder="0" value={form.quantity} onChange={handle} />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="stock-note">Note (optionnel)</label>
        <input id="stock-note" name="note" className="input"
          placeholder="Ex : Livraison fournisseur" value={form.note} onChange={handle} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" id="stock-submit"
          className={`flex-1 btn ${isEntry ? 'btn-success' : 'btn-danger'}`} disabled={loading}>
          {loading ? '⏳...' : isEntry ? '✅ Ajouter' : '✅ Retirer'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  )
}
