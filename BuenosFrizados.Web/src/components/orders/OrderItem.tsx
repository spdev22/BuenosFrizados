import type { OrderItem as OrderItemType } from '../../types'

interface OrderItemProps {
    item: OrderItemType
    onRemove: (productId: number) => void
    onIncreaseQuantity: (productId: number) => void
    onDecreaseQuantity: (productId: number) => void
}

export default function OrderItem({ item, onRemove, onIncreaseQuantity, onDecreaseQuantity }: OrderItemProps) {
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
                    <p className="text-xs text-gray-400">
                        ${item.unitPrice.toLocaleString('es-AR')} c/u
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-300">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                </span>
                
                {/* Controles de cantidad */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDecreaseQuantity(item.productId)}
                        className="w-7 h-7 bg-[#1a1a1a] hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 rounded-lg text-sm transition-all duration-200 flex items-center justify-center border border-[#2a2a2a] cursor-pointer"
                        disabled={item.quantity <= 1}
                    >
                        −
                    </button>
                    <span className="text-sm font-medium text-white min-w-[20px] text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => onIncreaseQuantity(item.productId)}
                        className="w-7 h-7 bg-[#1a1a1a] hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 rounded-lg text-sm transition-all duration-200 flex items-center justify-center border border-[#2a2a2a] cursor-pointer"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={() => onRemove(item.productId)}
                    className="w-8 h-8 bg-[#1a1a1a] hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-sm transition-all duration-200 flex items-center justify-center border border-[#2a2a2a] cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}