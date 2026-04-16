import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateOrderRequest, OrderItem } from '../types'
import { createOrder } from '../api/orders'
import OrderForm from '../components/orders/OrderForm'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'

interface CheckoutPageProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onClearCart: () => void
}

export default function CheckoutPage({ items, onRemove, onClearCart }: CheckoutPageProps) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { toast, showToast, hideToast } = useToast()

    const handleSubmit = async (order: CreateOrderRequest) => {
        setLoading(true)
        try {
            await createOrder(order)
            onClearCart()
            showToast('Order placed successfully!', 'success')
            setTimeout(() => navigate('/menu'), 1500)
        } catch (error) {
            showToast('Something went wrong. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-1 h-10 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                    Your order
                </h1>
                <p className="text-gray-400 mt-2 ml-7">Review your items and complete your order</p>
            </div>
            {loading
                ? <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 mt-4">Placing your order...</p>
                  </div>
                : <OrderForm items={items} onRemove={onRemove} onSubmit={handleSubmit} onError={(message) => showToast(message, 'error')}
                />
            }
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}