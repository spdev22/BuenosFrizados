import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-4xl text-center">{product.emoji}</div>
            <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <span className="font-medium text-teal-600">
                    ${product.price.toLocaleString('es-AR')}
                </span>
                <button
                    onClick={() => onAdd(product)}
                    className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                >
                    Add
                </button>
            </div>
        </div>
    )
}