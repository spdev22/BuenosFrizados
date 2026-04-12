import { useState } from 'react'
import type { Product, OrderItem } from './types'
import Navbar from './components/shared/Navbar'
import MenuPage from './pages/MenuPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('menu')
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

  const handleSuccess = () => {
    setCartItems([])
    setCurrentPage('menu')
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartCount={cartCount}
      />
      <main className="max-w-4xl mx-auto px-6 py-8">
        {currentPage === 'menu' && (
          <MenuPage onAdd={handleAdd} />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            onRemove={handleRemove}
            onSuccess={handleSuccess}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPage />
        )}
      </main>
    </div>
  )
}