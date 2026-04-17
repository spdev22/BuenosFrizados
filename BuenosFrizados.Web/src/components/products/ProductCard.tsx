import { useState } from 'react'
import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    onAdd: (product: Product, quantity?: number) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    const [isAdded, setIsAdded] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const handleAdd = () => {
        onAdd(product, quantity)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 1500) // Reset after 1.5 seconds
    }

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    return (
        <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-5 flex flex-col gap-4 shadow-xl hover:shadow-2xl hover:shadow-[#FF6B00]/25 transition-all duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden rounded-xl">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                {isAdded && (
                    <div className="absolute inset-0 bg-[#FF6B35]/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-[#FF6B35]/90 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                            ¡✓ Agregado!
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>
            </div>
            <div className="flex flex-col gap-3 mt-auto pt-2">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-[#FF6B00]">
                        ${product.price.toLocaleString('es-AR')}
                    </span>
                    <div className="flex items-center gap-2 bg-[#0f0f0f]/70 rounded-lg border border-[#2a2a2a]">
                        <button
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            −
                        </button>
                        <span className="w-8 text-center text-white text-sm font-medium">{quantity}</span>
                        <button
                            onClick={increaseQuantity}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`w-full py-2.5 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                        isAdded 
                            ? 'bg-[#FF6B35] scale-105 animate-bounce cursor-not-allowed' 
                            : 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#FF5500] hover:to-[#FF6B00] hover:scale-105'
                    }`}
                >
                    {isAdded ? '✓ ¡Agregado!' : `Agregar ${quantity > 1 ? `(${quantity})` : ''}`}
                </button>
            </div>
        </div>
    )
}