import type { Order } from '../../types'

interface OrderListProps {
    orders: Order[]
    onConfirm: (id: number) => void
    onDeliver: (id: number) => void
    onCancel: (id: number) => void
}

const statusStyles: Record<string, string> = {
    Pending: 'bg-amber-900/30 text-amber-400 border-amber-800/50',
    Confirmed: 'bg-teal-900/30 text-teal-400 border-teal-800/50',
    Delivered: 'bg-green-900/30 text-green-400 border-green-800/50',
    Cancelled: 'bg-red-900/30 text-red-400 border-red-800/50',
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
                <div key={order.id} className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-semibold text-white">Client #{order.clientId}</p>
                            <p className="text-sm text-gray-300 mt-1">{order.clientPhoneNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">{order.orderDate}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="font-bold text-[#FF6B00] text-lg">
                                ${order.total.toLocaleString('es-AR')}
                            </span>
                            <span className={`text-xs px-3 py-1.5 rounded-xl font-medium border ${statusStyles[order.status] ?? 'bg-gray-800/50 text-gray-500 border-gray-700/50'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2a2a2a]/60">
                        {order.items.map(item => (
                            <p key={item.productId} className="text-sm text-gray-400 py-1">
                                {item.productName} x{item.quantity} — ${item.unitPrice.toLocaleString('es-AR')}
                            </p>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                        {order.status === 'Pending' && (
                            <>
                                <button
                                    onClick={() => onConfirm(order.id)}
                                    className="px-4 py-2 border-2 border-teal-800/50 text-teal-400 text-xs rounded-xl hover:bg-teal-900/30 hover:border-teal-700 transition-all duration-200"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => onCancel(order.id)}
                                    className="px-4 py-2 border-2 border-red-800/50 text-red-400 text-xs rounded-xl hover:bg-red-900/30 hover:border-red-700 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        {order.status === 'Confirmed' && (
                            <button
                                onClick={() => onDeliver(order.id)}
                                className="px-4 py-2 border-2 border-green-800/50 text-green-400 text-xs rounded-xl hover:bg-green-900/30 hover:border-green-700 transition-all duration-200"
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