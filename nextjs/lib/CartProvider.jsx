'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const Ctx = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [rentals, setRentals] = useState([])
  const [transportBookings, setTransportBookings] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      const c = localStorage.getItem('chimavet-cart')
      if (c) setCart(JSON.parse(c))
      const r = localStorage.getItem('chimavet-rentals')
      if (r) setRentals(JSON.parse(r))
      const t = localStorage.getItem('chimavet-transport')
      if (t) setTransportBookings(JSON.parse(t))
    } catch {}
  }, [])

  useEffect(() => { try { localStorage.setItem('chimavet-cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => { try { localStorage.setItem('chimavet-rentals', JSON.stringify(rentals)) } catch {} }, [rentals])
  useEffect(() => { try { localStorage.setItem('chimavet-transport', JSON.stringify(transportBookings)) } catch {} }, [transportBookings])

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === product.id)
      if (ex) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...product, qty: 1 }]
    })
    setDrawerOpen(true)
  }, [])

  const changeQty = useCallback((id, d) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const addRental = useCallback((r) => setRentals(prev => [...prev, { id: Date.now(), ...r }]), [])
  const removeRental = useCallback((id) => setRentals(prev => prev.filter(r => r.id !== id)), [])
  const addTransport = useCallback((b) => setTransportBookings(prev => [...prev, { id: Date.now(), ...b }]), [])
  const removeTransport = useCallback((id) => setTransportBookings(prev => prev.filter(b => b.id !== id)), [])

  return (
    <Ctx.Provider value={{
      cart, addToCart, changeQty, clearCart, drawerOpen, openDrawer, closeDrawer,
      rentals, addRental, removeRental,
      transportBookings, addTransport, removeTransport
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
