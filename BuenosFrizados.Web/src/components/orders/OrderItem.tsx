import type { OrderItem as OrderItemType } from '../../types'

interface OrderItemProps {
    item: OrderItemType
    onRemove: (productId: number) => void
}

export default function OrderItem({ item, onRemove }: OrderItemProps) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
            <div>
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-500">x{item.quantity}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                </span>
                <button
                    onClick={() => onRemove(item.productId)}
                    className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}