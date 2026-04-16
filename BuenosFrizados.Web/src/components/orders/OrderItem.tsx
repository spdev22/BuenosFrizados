import type { OrderItem as OrderItemType } from '../../types'

interface OrderItemProps {
    item: OrderItemType
    onRemove: (productId: number) => void
}

export default function OrderItem({ item, onRemove }: OrderItemProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]/60 last:border-none">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md border border-[#2a2a2a]/50">
                    {item.imageUrl ? (
                        <img 
                            src={item.imageUrl} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-white text-lg">
                            🍟
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{item.productName}</p>
                    <p className="text-xs text-gray-500 font-medium">x{item.quantity}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-300">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                </span>
                <button
                    onClick={() => onRemove(item.productId)}
                    className="w-8 h-8 bg-[#1a1a1a] hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-sm transition-all duration-200 flex items-center justify-center border border-[#2a2a2a]"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}