import type { Product } from '../../types'

interface ProductAdminListProps {
    products: Product[]
    onEdit: (product: Product) => void
    onToggle: (product: Product) => void
}

export default function ProductAdminList({ products, onEdit, onToggle }: ProductAdminListProps) {
    if (products.length === 0) {
        return <p className="text-center text-gray-400 py-12">No products yet</p>
    }

    return (
        <div className="flex flex-col gap-3">
            {products.map(product => (
                <div key={product.id} className="bg-white border border-[#dce8f5] rounded-xl p-4 flex items-center gap-4">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <p className="font-medium text-[#0c1a2e] text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>
                        <p className="text-sm font-medium text-[#185FA5] mt-1">${product.price.toLocaleString('es-AR')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${product.isActive
                                ? 'bg-[#e6f1fb] text-[#0C447C]'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                            onClick={() => onEdit(product)}
                            className="px-3 py-1.5 border border-[#dce8f5] text-[#0c1a2e] text-xs rounded-lg hover:bg-[#f4f7fb] transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onToggle(product)}
                            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${product.isActive
                                    ? 'border-red-200 text-red-500 hover:bg-red-50'
                                    : 'border-[#dce8f5] text-[#185FA5] hover:bg-[#e6f1fb]'
                                }`}
                        >
                            {product.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}