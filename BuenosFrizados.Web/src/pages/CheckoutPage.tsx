import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateOrderRequest, OrderItem } from '../types'
import { createOrder } from '../api/orders'
import OrderForm from '../components/orders/OrderForm'

interface CheckoutPageProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onClearCart: () => void
}

export default function CheckoutPage({ items, onRemove, onClearCart }: CheckoutPageProps) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (order: CreateOrderRequest) => {
        setLoading(true)
        try {
            await createOrder(order)
            onClearCart()
            navigate('/menu')
        } catch (error) {
            alert('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1 className="text-xl font-medium text-gray-900 mb-6">Your order</h1>
            {loading
                ? <p className="text-center text-gray-400 py-12">Placing your order...</p>
                : <OrderForm items={items} onRemove={onRemove} onSubmit={handleSubmit} />
            }
        </div>
    )
}