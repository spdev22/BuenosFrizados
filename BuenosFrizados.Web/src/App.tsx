import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { Product, OrderItem } from './types'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import ProtectedRoute from './components/shared/ProtectedRoute'
import MenuPage from './pages/MenuPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'

export default function App() {
  // set estado: items en el carrito
  // como funciona el use state? => funcion que toma un valor inicial y devuelve el estado actual y una funcion para cambiar ese valor
  const [cartItems, setCartItems] = useState<OrderItem[]>([])

  // declaracion de una funciona para manejar el agregado de un item al carrito
  const handleAdd = (product: Product, quantity: number = 1) => {
    // cambiando el estado del carrito ya que estamos agregando un producto.
    // si el producto ya esta agregado aumenta la cantidad segun lo seleccionado sino lo agrega a la lista
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.price,
        imageUrl: product.imageUrl
      }]
    })
  }

  // lo mismo que el anterior pero esta funcion devuelve la lista sin el producto a remover 
  const handleRemove = (productId: number) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId))
  }

  // cuenta la cantidad de productos en total de cada producto en el carro.
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
        <Navbar cartCount={cartCount} />
        <main className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/menu" />} />
            <Route path="/menu" element={<MenuPage cartItems={cartItems} onAdd={handleAdd} />} />
            <Route path="/order" element={
              <CheckoutPage
                items={cartItems}
                onRemove={handleRemove}
                onClearCart={() => setCartItems([])}
              />
            } />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}