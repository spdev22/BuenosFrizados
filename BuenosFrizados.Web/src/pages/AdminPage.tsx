import { useEffect, useState } from 'react'
import type { Order } from '../types'
import { getOrders, confirmOrder, deliverOrder, cancelOrder } from '../api/orders'
import OrderList from '../components/orders/OrderList'

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getOrders()
            .then(setOrders)
            .finally(() => setLoading(false))
    }, [])

    const handleConfirm = async (id: number) => {
        await confirmOrder(id)
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Confirmed' } : o))
    }

    const handleDeliver = async (id: number) => {
        await deliverOrder(id)
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Delivered' } : o))
    }

    const handleCancel = async (id: number) => {
        await cancelOrder(id)
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o))
    }

    if (loading) {
        return <p className="text-center text-gray-400 py-12">Loading...</p>
    }

    return (
        <div>
            <h1 className="text-xl font-medium text-gray-900 mb-6">Orders</h1>
            <OrderList
                orders={orders}
                onConfirm={handleConfirm}
                onDeliver={handleDeliver}
                onCancel={handleCancel}
            />
        </div>
    )
}