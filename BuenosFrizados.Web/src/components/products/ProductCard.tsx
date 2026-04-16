import { useState } from 'react'
import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    const [isAdded, setIsAdded] = useState(false)

    const handleAdd = () => {
        onAdd(product)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 1500) // Reset after 1.5 seconds
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
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                            ✓ Added to cart!
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
                <span className="font-bold text-xl text-[#FF6B00]">
                    ${product.price.toLocaleString('es-AR')}
                </span>
                <button
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`px-5 py-2.5 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                        isAdded 
                            ? 'bg-green-500 scale-110 animate-bounce cursor-not-allowed' 
                            : 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#FF5500] hover:to-[#FF6B00] hover:scale-105'
                    }`}
                >
                    {isAdded ? '✓ Added!' : 'Add'}
                </button>
            </div>
        </div>
    )
}