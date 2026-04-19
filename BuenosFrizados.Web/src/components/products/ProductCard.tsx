import { useRef, useState } from 'react'
import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    cartItems: Array<{ productId: number, quantity: number }>
    onAdd: (product: Product, quantity?: number) => void
}

export default function ProductCard({ product, cartItems, onAdd }: ProductCardProps) {
    const [isAdded, setIsAdded] = useState(false)
    const timeoutRef = useRef(null)

    const currentQuantity = cartItems.find(item => item.productId === product.id)?.quantity || 0

    const handleAdd = () => {
        onAdd(product, 1)
        setIsAdded(true)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setIsAdded(false), 1500)
    }


    return (
        <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6B00]/25 transition-all duration-300 hover:-translate-y-2">
            <div className="relative overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {isAdded && (
                    <div className="absolute inset-0 bg-[#FF6B35]/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-[#FF6B35]/90 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                            ✓ Agregado {currentQuantity > 1 ? '(' + currentQuantity + ')' : ''}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-1 text-center justify-between">
                <div>
                    {/* Nombre del producto */}
                    <h3 className="font-extralight text-white text-base tracking-widest h-[3rem] flex items-center justify-center leading-none truncate px-2">{product.name}</h3>

                    {/* Descripción simulada */}
                    <p className="text-sm text-gray-400 line-clamp-1">{product.description}</p>
                </div>

                {/* Precio */}
                <div className="text-center mt-5 mb-5">
                    <span className="font-cabinet font-light text-3xl text-[#FF6B35] tracking-wide">
                        ${product.price.toLocaleString('es-AR')}
                    </span>
                </div>
                <button
                    onClick={handleAdd}
                    className={`w-full py-3 px-6 text-base font-medium rounded-full border-2 transition-all duration-200 shadow-lg hover:shadow-xl ${isAdded
                        ? 'bg-[#FF6B35] border-[#FF6B35] text-white scale-105 cursor-pointer'
                        : 'bg-transparent border-[#FF6B35] text-[#FF6B35] hover:bg-gradient-to-r hover:from-[#FF6B00] hover:to-[#FF8533] hover:text-white hover:border-transparent cursor-pointer'
                        }`}
                >
                    Agregar
                </button>
            </div>
        </div>
    )
}