import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getProducts, getUsers, createPurchaseList, getPurchaseLists, markWhatsappSent, deletePurchaseList } from '../api'
import Modal from '../components/ui/Modal'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function PurchaseList() {
  const [products,  setProducts]  = useState([])
  const [users,     setUsers]     = useState([])
  const [history,   setHistory]   = useState([])
  const [selected,  setSelected]  = useState({})   // { productId: quantity }
  const [loading,   setLoading]   = useState(true)
  const [sending,   setSending]   = useState(false)
  const [whatsappModal, setWhatsappModal] = useState(null) // listId à envoyer
  const [recipientId, setRecipientId] = useState('')
  const [readyLink, setReadyLink] = useState(null)

  const load = () => {
    Promise.all([getProducts(), getUsers(), getPurchaseLists()])
      .then(([pr, us, hi]) => {
        const prods = pr.data.data
        setProducts(prods)
        setUsers(us.data.data)
        setHistory(hi.data.data)
        // Pré-sélectionner les produits en alerte
        const preSelected = {}
        prods.forEach(p => {
          if (p.quantity < p.minThreshold) {
            preSelected[p._id] = Math.max(1, p.minThreshold - p.quantity)
          }
        })
        setSelected(preSelected)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleProduct = (id) => {
    setSelected(s => {
      const copy = { ...s }
      if (copy[id] !== undefined) {
        delete copy[id]
      } else {
        const p = products.find(x => x._id === id)
        copy[id] = Math.max(1, (p?.minThreshold || 1) - (p?.quantity || 0))
      }
      return copy
    })
  }

  const setQty = (id, qty) => {
    setSelected(s => ({ ...s, [id]: Math.max(1, Number(qty)) }))
  }

  const handleSaveDraft = async () => {
    const items = buildItems()
    if (items.length === 0) { toast.error('Sélectionnez au moins un produit'); return }
    setSending(true)
    try {
      await createPurchaseList({ items })
      toast.success('Liste sauvegardée !')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally { setSending(false) }
  }

  const handlePrepareWhatsApp = async () => {
    if (!whatsappModal) return
    const user = users.find(u => u._id === recipientId)
    if (!user || !user.phone) { toast.error('Sélectionnez un destinataire avec un numéro valide'); return }
    
    setSending(true)
    try {
      let listId = whatsappModal
      let currentItems = []
      
      if (listId === 'new') {
        currentItems = buildItems()
        if (currentItems.length === 0) { toast.error('Liste vide'); setSending(false); return }
        const res = await createPurchaseList({ items: currentItems })
        listId = res.data.data._id
      } else {
        const list = history.find(l => l._id === listId)
        currentItems = list.items
      }

      const itemsText = currentItems
        .map(i => `• *${i.productName}* : ${i.quantity} ${i.unit}`)
        .join('\n');
      
      const total = currentItems.reduce((acc, i) => acc + (i.quantity * (i.price || 0)), 0);
      const message = `*☕ TALA COFFEE SHOP*\n*Liste d'achat*\n\n${itemsText}\n\n*Total estimé : ${total.toFixed(2)} DA*\n\nMerci !`;
      
      const rawPhone = user.phone.replace(/[\s\+]+/g, ''); // Enlever espaces et +
      const encodedMessage = encodeURIComponent(message);
      
      let finalPhone = rawPhone;
      if (user.phone.startsWith('0')) {
        finalPhone = `213${rawPhone.substring(1)}`; // Algérie
      } else if (user.phone.startsWith('+')) {
        finalPhone = rawPhone; // Déjà au format international (sans le +)
      }

      const link = `https://wa.me/${finalPhone}?text=${encodedMessage}`;
      
      setReadyLink(link);

      // Marquer comme envoyé dans la BDD
      await markWhatsappSent({ 
        listId, 
        recipient: { email: user.email, name: user.name, phone: user.phone } 
      })
      
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally { setSending(false) }
  }

  const handleCloseModal = () => {
    setWhatsappModal(null);
    setRecipientId('');
    setReadyLink(null);
  }

  const handleResend = (listId) => {
    setWhatsappModal(listId)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette liste ?')) return
    try {
      await deletePurchaseList(id)
      toast.success('Liste supprimée')
      load()
    } catch { toast.error('Erreur') }
  }

  const buildItems = () =>
    Object.entries(selected).map(([id, qty]) => {
      const p = products.find(x => x._id === id)
      return { product: id, productName: p?.name, quantity: qty, unit: p?.unit, price: p?.price || 0 }
    })

  const calculateTotal = () => {
    return Object.entries(selected).reduce((total, [id, qty]) => {
      const p = products.find(x => x._id === id)
      return total + (qty * (p?.price || 0))
    }, 0)
  }

  const isAllSelected = products.length > 0 && products.every(p => selected[p._id] !== undefined)

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected({})
    } else {
      const all = {}
      products.forEach(p => { all[p._id] = Math.max(1, p.minThreshold - p.quantity) })
      setSelected(all)
    }
  }

  if (loading) return <p className="p-6 text-coffee-pale">Chargement...</p>

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="page-header">
        <h1 className="page-title">🛒 Liste d'achat</h1>
        <div className="flex gap-2">
          <button id="btn-save-draft" className="btn-secondary" onClick={handleSaveDraft} disabled={sending}>
            💾 Sauvegarder
          </button>
          <button id="btn-send-whatsapp" className="btn-primary" onClick={() => setWhatsappModal('new')} disabled={sending}>
            📱 WhatsApp
          </button>
        </div>
      </div>

      {/* Générateur */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-coffee">Sélectionner les produits à acheter</p>
          <button className="btn-secondary btn-sm" onClick={toggleAll}>
            {isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        </div>

        <div className="space-y-2">
          {products.map(p => {
            const isChecked = selected[p._id] !== undefined
            const isAlert   = p.quantity < p.minThreshold
            return (
              <div key={p._id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                  ${isChecked
                    ? 'bg-cream border-coffee/30 shadow-soft'
                    : 'bg-white border-coffee/10 hover:border-coffee/20'}
                  ${isAlert ? 'border-l-4 border-l-amber-400' : ''}`}
              >
                <input
                  type="checkbox"
                  id={`item-${p._id}`}
                  checked={isChecked}
                  onChange={() => toggleProduct(p._id)}
                  className="w-4 h-4 accent-coffee rounded cursor-pointer"
                />
                <label htmlFor={`item-${p._id}`} className="flex-1 cursor-pointer">
                  <span className="font-medium text-coffee-dark text-sm">{p.name}</span>
                  <span className="text-xs text-coffee-pale ml-2">
                    ({p.quantity} / {p.minThreshold} {p.unit})
                  </span>
                  {isAlert && <span className="ml-2 text-xs text-amber-600 font-semibold">⚠️ Alerte</span>}
                </label>
                {isChecked && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-coffee-light">Qté :</label>
                    <input
                      type="number"
                      min="1"
                      value={selected[p._id]}
                      onChange={e => setQty(p._id, e.target.value)}
                      className="input w-20 text-sm py-1"
                    />
                    <span className="text-xs text-coffee-pale">{p.unit}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {Object.keys(selected).length > 0 && (
          <div className="bg-cream-dark rounded-xl p-3 flex flex-col sm:flex-row justify-between sm:items-center text-sm text-coffee gap-2">
            <div>
              <strong>{Object.keys(selected).length}</strong> produit(s) sélectionné(s) —{' '}
              <strong>{Object.values(selected).reduce((a, b) => a + b, 0)}</strong> unités au total
            </div>
            <div className="font-display text-lg">
              Total estimé : <strong>{calculateTotal().toFixed(2)} DA</strong>
            </div>
          </div>
        )}
      </div>

      {/* Historique des listes */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-display text-coffee-dark">📜 Listes précédentes</h2>
          <div className="space-y-3">
            {history.map(list => (
              <div key={list._id} className="card flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${list.status.includes('sent') ? 'badge-ok' : 'bg-cream-dark text-coffee'}`}>
                      {list.status === 'whatsapp_sent' ? '📱 WhatsApp Envoyé' : list.status === 'sent' ? '✅ Email Envoyé' : '📝 Brouillon'}
                    </span>
                    <span className="text-xs text-coffee-pale">
                      {format(new Date(list.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </span>
                    {(list.sentToName || list.sentToPhone) && (
                      <span className="text-xs text-coffee-light">→ {list.sentToName} {list.sentToPhone && `(${list.sentToPhone})`}</span>
                    )}
                    {list.totalAmount > 0 && (
                      <span className="text-xs font-semibold text-coffee ml-auto">
                        {list.totalAmount.toFixed(2)} DA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-coffee-pale mt-1">
                    {list.items.map(i => `${i.productName} ×${i.quantity}`).join(' · ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary btn-sm" onClick={() => handleResend(list._id)}>
                    📱 Renvoyer
                  </button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(list._id)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal WhatsApp */}
      <Modal
        isOpen={!!whatsappModal}
        onClose={handleCloseModal}
        title="📱 Envoyer la liste par WhatsApp"
        size="sm"
      >
        <div className="space-y-4">
          {!readyLink ? (
            <>
              <div className="form-group">
                <label className="label" htmlFor="wa-recipient">Destinataire</label>
                <select id="wa-recipient" className="input"
                  value={recipientId} onChange={e => setRecipientId(e.target.value)}>
                  <option value="">Choisir un employé...</option>
                  {users.filter(u => u.role === 'employee' || u.role === 'admin').map(u => (
                    <option key={u._id} value={u._id}>{u.name} — {u.phone || 'Pas de numéro'}</option>
                  ))}
                </select>
              </div>
              <div className="bg-cream-dark rounded-xl p-3 text-xs text-coffee-light">
                <p className="font-semibold text-coffee mb-1">WhatsApp Direct</p>
                <p>La liste sera préparée et vous pourrez ensuite l'envoyer.</p>
              </div>
              <div className="flex gap-3">
                <button id="confirm-prepare-wa" className="btn-primary flex-1"
                  onClick={handlePrepareWhatsApp} disabled={sending}>
                  {sending ? '⏳ Préparation...' : '✅ Préparer le message'}
                </button>
                <button className="btn-secondary" onClick={handleCloseModal}>Annuler</button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="bg-white border border-coffee/10 rounded-xl p-4 text-left shadow-inner max-h-48 overflow-y-auto">
                <p className="text-[10px] uppercase tracking-widest text-coffee-pale mb-2 font-bold">Aperçu du message :</p>
                <div className="text-xs text-coffee-dark whitespace-pre-wrap font-mono">
                  {readyLink ? decodeURIComponent(readyLink.split('text=')[1]) : ''}
                </div>
              </div>
              
              <a 
                href={readyLink} 
                target="_blank" 
                rel="noreferrer"
                onClick={handleCloseModal}
                className="btn-primary w-full inline-block text-center py-4 text-lg"
              >
                🚀 Envoyer sur WhatsApp
              </a>
              <p className="text-[10px] text-coffee-pale">Cela ouvrira WhatsApp avec le texte ci-dessus prêt à être expédié.</p>
              <button className="text-xs text-coffee-light underline" onClick={() => setReadyLink(null)}>
                Modifier la liste
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
