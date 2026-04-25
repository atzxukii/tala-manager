import { useEffect, useState } from 'react'
import { getPurchaseLists, getProducts } from '../api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { format, parseISO, startOfDay, startOfWeek, startOfMonth, subDays, isAfter } from 'date-fns'
import { fr } from 'date-fns/locale'

const COLORS = ['#808A77', '#384031', '#A69286', '#E5D3C8', '#D4B89A', '#7A6251'];

export default function Statistics() {
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState([])
  const [products, setProducts] = useState([])
  const [period, setPeriod] = useState('month') // 'day', 'week', 'month'

  const loadData = async () => {
    try {
      const [resLists, resProducts] = await Promise.all([
        getPurchaseLists(),
        getProducts()
      ])
      setLists(resLists.data.data)
      setProducts(resProducts.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // Calculer le total des dépenses
  const totalDZA = lists.reduce((sum, list) => sum + (list.totalAmount || 0), 0)

  // Logique de regroupement par période
  const getChartData = () => {
    const data = {}
    const now = new Date()

    lists.forEach(list => {
      if (!list.totalAmount) return
      const date = parseISO(list.createdAt)
      let label = ''

      if (period === 'day') {
        // Afficher les 7 derniers jours individuellement
        if (isAfter(date, subDays(now, 7))) {
          label = format(date, 'dd MMM', { locale: fr })
        } else return
      } else if (period === 'week') {
        // Afficher par numéro de semaine
        label = `Sem. ${format(date, 'ww')}`
      } else {
        // Afficher par mois
        label = format(date, 'MMM yyyy', { locale: fr })
      }

      if (!data[label]) data[label] = 0
      data[label] += list.totalAmount
    })

    return Object.keys(data).map(key => ({
      name: key,
      Dépenses: data[key]
    }))
  }

  // Calculer les produits les plus commandés
  const topProducts = () => {
    const data = {}
    lists.forEach(list => {
      list.items.forEach(item => {
        if (!data[item.productName]) data[item.productName] = 0
        data[item.productName] += item.quantity
      })
    })
    
    return Object.keys(data)
      .map(key => ({ name: key, value: data[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  if (loading) return <p className="p-6 text-coffee-pale">Chargement des statistiques...</p>

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="page-header">
        <h1 className="page-title">📊 Statistiques & Dépenses</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-coffee text-white flex flex-col justify-center items-center py-8">
          <p className="text-coffee-light/80 text-sm font-medium uppercase tracking-widest mb-2">Total Dépenses</p>
          <p className="text-4xl font-display">{totalDZA.toLocaleString()} DA</p>
        </div>
        <div className="card flex flex-col justify-center items-center py-8 border border-coffee/10">
          <p className="text-coffee-pale text-sm font-medium uppercase tracking-widest mb-2">Commandes Passées</p>
          <p className="text-4xl font-display text-coffee-dark">{lists.length}</p>
        </div>
        <div className="card flex flex-col justify-center items-center py-8 border border-coffee/10">
          <p className="text-coffee-pale text-sm font-medium uppercase tracking-widest mb-2">Produits en Base</p>
          <p className="text-4xl font-display text-coffee-dark">{products.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Dépenses */}
        <div className="card flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-medium text-coffee-dark">Évolution des dépenses</h2>
            
            {/* Sélecteur de période */}
            <div className="flex bg-cream-dark p-1 rounded-xl border border-coffee/10">
              <button 
                onClick={() => setPeriod('day')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${period === 'day' ? 'bg-coffee text-white shadow-sm' : 'text-coffee-pale hover:text-coffee'}`}
              >
                Jour
              </button>
              <button 
                onClick={() => setPeriod('week')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${period === 'week' ? 'bg-coffee text-white shadow-sm' : 'text-coffee-pale hover:text-coffee'}`}
              >
                Semaine
              </button>
              <button 
                onClick={() => setPeriod('month')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${period === 'month' ? 'bg-coffee text-white shadow-sm' : 'text-coffee-pale hover:text-coffee'}`}
              >
                Mois
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D3C8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7A6251', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7A6251', fontSize: 11 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f7f4f2' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value.toLocaleString()} DA`, 'Dépenses']}
                />
                <Bar dataKey="Dépenses" fill="#808A77" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Produits les plus demandés */}
        <div className="card flex flex-col">
          <h2 className="text-lg font-medium text-coffee-dark mb-6">Top 5 Produits commandés</h2>
          <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topProducts().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {topProducts().map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-coffee-dark font-medium">{entry.name}</span>
                  <span className="text-coffee-light ml-auto">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
