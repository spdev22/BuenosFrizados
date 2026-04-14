import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    return (
        <div className="bg-white border border-[#dce8f5] rounded-xl p-4 flex flex-col gap-3">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-36 object-cover rounded-lg"
            />
            <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <span className="font-medium text-[#185FA5]">
                    ${product.price.toLocaleString('es-AR')}
                </span>
                <button
                    onClick={() => onAdd(product)}
                    className="px-4 py-2 bg-[#378ADD] text-white text-sm rounded-lg hover:bg-[#185FA5] transition-colors"
                >
                    Add
                </button>
            </div>
        </div>
    )
}