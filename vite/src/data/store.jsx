import { createContext, useContext, useState, useEffect } from 'react'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([])
  const [autoMode, setAutoMode] = useState(true)
  const [manualOverride, setManualOverride] = useState(false)
  const [isOn, setIsOn] = useState(true)
  const [sensor, setSensor] = useState({ moisture: 42, temp: 24, humidity: 58, flow: 2.4 })
  const [rentals, setRentals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_rentals') || '[]') } catch { return [] }
  })
  const [transportBookings, setTransportBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_transport') || '[]') } catch { return [] }
  })

  useEffect(() => { try { localStorage.setItem('cv_rentals', JSON.stringify(rentals)) } catch {} }, [rentals])
  useEffect(() => { try { localStorage.setItem('cv_transport', JSON.stringify(transportBookings)) } catch {} }, [transportBookings])

  const addToCart = (id, products) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    setCart(prev => {
      const ex = prev.find(c => c.id === id)
      if (ex) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...p, qty: 1 }]
    })
  }
  const changeQty = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0))
  const clearCart = () => setCart([])
  const toggleAuto = (v) => { setAutoMode(v); setManualOverride(false) }
  const toggleOverride = () => { setManualOverride(o => { const n = !o; setIsOn(n); return n }) }
  const addRental = (r) => setRentals(prev => [...prev, { id: Date.now(), ...r }])
  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))
  const addTransport = (b) => setTransportBookings(prev => [...prev, { id: Date.now(), ...b }])
  const removeTransport = (id) => setTransportBookings(prev => prev.filter(b => b.id !== id))

  useEffect(() => {
    const t = setInterval(() => {
      setSensor(prev => {
        if (!autoMode || manualOverride) return prev
        const m = Math.max(20, Math.min(80, prev.moisture + (Math.random() - 0.5) * 3))
        if (autoMode && !manualOverride) setIsOn(m < 45)
        return { ...prev, moisture: m }
      })
    }, 4000)
    return () => clearInterval(t)
  }, [autoMode, manualOverride])

  return (
    <StoreContext.Provider value={{
      cart, addToCart, changeQty, clearCart,
      autoMode, manualOverride, isOn, toggleAuto, toggleOverride, sensor,
      rentals, addRental, removeRental,
      transportBookings, addTransport, removeTransport
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
