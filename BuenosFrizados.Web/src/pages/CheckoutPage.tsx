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
            <h1 className="text-xl font-medium text-[#0c1a2e] mb-6">Your order</h1>
            {loading
                ? <p className="text-center text-gray-400 py-12">Placing your order...</p>
                : <OrderForm items={items} onRemove={onRemove} onSubmit={handleSubmit} onError={(message) => showToast(message, 'error')}
                />
            }
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}