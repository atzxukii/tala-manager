import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Products ───────────────────────────────────────────────
export const getProducts    = ()       => api.get('/products')
export const getProductById = (id)     => api.get(`/products/${id}`)
export const createProduct  = (data)   => api.post('/products', data)
export const updateProduct  = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct  = (id)     => api.delete(`/products/${id}`)
export const getAlerts      = ()       => api.get('/products/alerts')

// ─── Stock ──────────────────────────────────────────────────
export const addStock    = (data) => api.post('/stock/entry', data)
export const removeStock = (data) => api.post('/stock/exit', data)

// ─── History ────────────────────────────────────────────────
export const getHistory = (params) => api.get('/history', { params })

// ─── Purchases ──────────────────────────────────────────────
export const getPurchaseLists    = ()       => api.get('/purchases')
export const getPurchaseListById = (id)     => api.get(`/purchases/${id}`)
export const createPurchaseList  = (data)   => api.post('/purchases', data)
export const deletePurchaseList  = (id)     => api.delete(`/purchases/${id}`)

// ─── Chat ──────────────────────────────────────────────────
export const getMessages = () => api.get('/chat')
export const sendMessage = (data) => api.post('/chat', data)
export const deleteMessage = (id) => api.delete(`/chat/${id}`)

// ─── WhatsApp ──────────────────────────────────────────────
export const markWhatsappSent = (data) => api.post('/whatsapp/mark-sent', data)

// ─── Email ──────────────────────────────────────────────────
export const sendEmail   = (data)     => api.post('/email/send', data)
export const resendEmail = (listId, data) => api.post(`/email/resend/${listId}`, data)

// ─── Users ──────────────────────────────────────────────────
export const getUsers    = ()         => api.get('/users')
export const createUser  = (data)     => api.post('/users', data)
export const updateUser  = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser  = (id)       => api.delete(`/users/${id}`)

export default api
