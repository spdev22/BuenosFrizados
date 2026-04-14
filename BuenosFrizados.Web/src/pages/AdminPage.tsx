import { useEffect, useState } from 'react'
import type { Order } from '../types'
import { getOrders, confirmOrder, deliverOrder, cancelOrder } from '../api/orders'
import OrderList from '../components/orders/OrderList'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const { toast, showToast, hideToast } = useToast()

    useEffect(() => {
        getOrders()
            .then(setOrders)
            .catch(() => showToast('Failed to load orders.', 'error'))
            .finally(() => setLoading(false))
    }, [])

    const handleConfirm = async (id: number) => {
        try {
            await confirmOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Confirmed' } : o))
            showToast('Order confirmed.', 'success')
        } catch {
            showToast('Failed to confirm order.', 'error')
        }
    }

    const handleDeliver = async (id: number) => {
        try {
            await deliverOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Delivered' } : o))
            showToast('Order marked as delivered.', 'success')
        } catch {
            showToast('Failed to update order.', 'error')
        }
    }

    const handleCancel = async (id: number) => {
        try {
            await cancelOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o))
            showToast('Order cancelled.', 'success')
        } catch {
            showToast('Failed to cancel order.', 'error')
        }
    }

    if (loading) {
        return <p className="text-center text-gray-400 py-12">Loading...</p>
    }

    return (
        <div>
            <h1 className="text-xl font-medium text-[#0c1a2e] mb-6">Orders</h1>
            <OrderList orders={orders} onConfirm={handleConfirm} onDeliver={handleDeliver} onCancel={handleCancel} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}