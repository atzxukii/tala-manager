import { useState, useEffect } from 'react'

const UNITS = ['kg', 'g', 'litre', 'ml', 'paquet', 'boîte', 'pièce', 'sachet', 'bouteille']
const CATEGORIES = ['Café', 'Lait', 'Sucre', 'Pain', 'Viennoiserie', 'Thé', 'Boisson', 'Consommable', 'Autre']

const defaultForm = {
  name: '', category: '', quantity: '', minThreshold: '', unit: 'kg', price: ''
}

export default function ProductForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || defaultForm)

  useEffect(() => {
    setForm(initial || defaultForm)
  }, [initial])

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      quantity:     Number(form.quantity),
      minThreshold: Number(form.minThreshold),
      price:        Number(form.price || 0),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="form-group">
        <label className="label" htmlFor="product-name">Nom du produit *</label>
        <input id="product-name" name="name" className="input" required
          placeholder="Ex : Café Arabica" value={form.name} onChange={handle} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label" htmlFor="product-category">Catégorie *</label>
          <select id="product-category" name="category" className="input" required
            value={form.category} onChange={handle}>
            <option value="">Choisir...</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="product-unit">Unité *</label>
          <select id="product-unit" name="unit" className="input" required
            value={form.unit} onChange={handle}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label" htmlFor="product-quantity">Quantité actuelle *</label>
          <input id="product-quantity" name="quantity" type="number" min="0" className="input" required
            placeholder="0" value={form.quantity} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="product-threshold">Seuil minimum</label>
          <input id="product-threshold" name="minThreshold" type="number" min="0" className="input"
            placeholder="0" value={form.minThreshold} onChange={handle} />
        </div>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="product-price">Prix unitaire (DA)</label>
        <input id="product-price" name="price" type="number" min="0" step="0.01" className="input"
          placeholder="0.00" value={form.price} onChange={handle} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" id="product-submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? '⏳ Enregistrement...' : '✅ Enregistrer'}
        </button>
        <button type="button" id="product-cancel" className="btn-secondary" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
