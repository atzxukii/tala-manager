import { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage, deleteMessage } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function TeamChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const loadMessages = async () => {
    try {
      const res = await getMessages()
      setMessages(res.data.data)
    } catch (err) {
      toast.error("Impossible de charger les messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
    // Poll messages every 10 seconds for real-time feel (optional simple implementation)
    const interval = setInterval(loadMessages, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      await sendMessage({
        sender: user._id,
        senderName: user.name,
        role: user.role,
        content: newMessage
      })
      setNewMessage('')
      await loadMessages()
    } catch (err) {
      toast.error("Erreur lors de l'envoi")
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return
    try {
      await deleteMessage(id)
      loadMessages()
    } catch (err) {
      toast.error("Erreur de suppression")
    }
  }

  if (loading) return <p className="p-6 text-coffee-pale">Chargement...</p>

  return (
    <div className="p-4 sm:p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="page-header mb-4 shrink-0">
        <h1 className="page-title">💬 Directives & Chat Équipe</h1>
      </div>

      <div className="flex-1 card flex flex-col bg-cream-dark overflow-hidden p-0 border border-coffee/10">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-coffee-pale">
              <p>Aucun message pour le moment. Commencez à discuter !</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === user._id;
              const isAdmin = msg.role === 'admin';
              
              return (
                <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-coffee-dark">{isMe ? 'Vous' : msg.senderName}</span>
                    {isAdmin && !isMe && <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Gérant</span>}
                    <span className="text-[10px] text-coffee-light">
                      {format(new Date(msg.createdAt), "HH:mm - dd MMM", { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="relative group max-w-[85%] sm:max-w-[70%]">
                    <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? 'bg-coffee text-white rounded-tr-none' 
                        : isAdmin 
                          ? 'bg-white border border-amber-200 rounded-tl-none' 
                          : 'bg-white border border-coffee/10 rounded-tl-none text-coffee-dark'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {(isMe || user.role === 'admin') && (
                      <button 
                        onClick={() => handleDelete(msg._id)}
                        className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-8' : '-right-8'} text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1`}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-coffee/10 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="input flex-1 bg-cream-dark"
              placeholder="Écrivez un message ou une directive..."
              disabled={sending}
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={sending || !newMessage.trim()}
            >
              {sending ? '⏳' : 'Envoyer'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
