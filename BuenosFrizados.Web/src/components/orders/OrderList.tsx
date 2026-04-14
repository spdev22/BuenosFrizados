import type { Order } from '../../types'

interface OrderListProps {
    orders: Order[]
    onConfirm: (id: number) => void
    onDeliver: (id: number) => void
    onCancel: (id: number) => void
}

const statusStyles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800',
    Confirmed: 'bg-teal-100 text-teal-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
}

export default function OrderList({ orders, onConfirm, onDeliver, onCancel }: OrderListProps) {
    if (orders.length === 0) {
        return (
            <p className="text-center text-gray-400 py-12">No orders yet</p>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {orders.map(order => (
                <div key={order.id} className="bg-white border border-[#dce8f5] rounded-xl p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Client #{order.clientId}</p>
                            <p className="text-sm text-gray-500 mt-1">{order.clientPhoneNumber}</p>
                            <p className="text-xs text-gray-400 mt-1">{order.orderDate}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="font-medium text-gray-900">
                                ${order.total.toLocaleString('es-AR')}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        {order.items.map(item => (
                            <p key={item.productId} className="text-xs text-gray-500">
                                {item.productName} x{item.quantity} — ${item.unitPrice.toLocaleString('es-AR')}
                            </p>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                        {order.status === 'Pending' && (
                            <>
                                <button
                                    onClick={() => onConfirm(order.id)}
                                    className="px-3 py-1.5 border border-teal-600 text-[#185FA5] text-xs rounded-lg hover:bg-teal-50 transition-colors"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => onCancel(order.id)}
                                    className="px-3 py-1.5 border border-red-400 text-red-400 text-xs rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        {order.status === 'Confirmed' && (
                            <button
                                onClick={() => onDeliver(order.id)}
                                className="px-3 py-1.5 border border-green-600 text-green-600 text-xs rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Mark as delivered
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}