import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateOrderRequest, OrderItem } from '../types'
import { createOrder } from '../api/orders'
import OrderForm from '../components/orders/OrderForm'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'
import PageHeader from '../components/shared/PageHeader'

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
            showToast('¡Pedido realizado con éxito!', 'primary')
            setTimeout(() => navigate('/menu'), 2000)
        } catch (error) {
            showToast('Algo salió mal. Por favor intentá de nuevo.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <PageHeader title="Tu pedido" subtitle="Revisá tus productos y completá tu pedido" />
            {loading
                ? <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 mt-4">Realizando tu pedido...</p>
                </div>
                : <OrderForm items={items} onRemove={onRemove} onSubmit={handleSubmit} onError={(message) => showToast(message, 'error')}
                />
            }
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}