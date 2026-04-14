import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { Product, OrderItem } from './types'
import Navbar from './components/shared/Navbar'
import MenuPage from './pages/MenuPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([])

  const handleAdd = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price
      }]
    })
  }

  const handleRemove = (productId: number) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId))
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f4f7fb]">
        <Navbar cartCount={cartCount} />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route path="/menu" element={<MenuPage onAdd={handleAdd} />} />
            <Route path="/order" element={
              <CheckoutPage
                items={cartItems}
                onRemove={handleRemove}
                onClearCart={() => setCartItems([])}
              />
            } />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}