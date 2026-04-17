import type { Product } from '../../types'

interface ProductAdminListProps {
    products: Product[]
    onEdit: (product: Product) => void
    onToggle: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductAdminList({ products, onEdit, onToggle, onDelete }: ProductAdminListProps) {
    if (products.length === 0) {
        return <p className="text-center text-gray-400 py-12">Aún no hay productos</p>
    }

    return (
        <div className="flex flex-col gap-4">
            {products.map(product => (
                <div key={product.id} className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-[#2a2a2a]/50"
                    />
                    <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                        <p className="text-sm font-semibold text-[#FF6B00] mt-2">${product.price.toLocaleString('es-AR')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium border ${product.isActive
                                ? 'bg-green-900/30 text-green-400 border-green-800/50'
                                : 'bg-gray-800/50 text-gray-500 border-gray-700/50'
                            }`}>
                            {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                        <button
                            onClick={() => onEdit(product)}
                            className="px-4 py-2 border-2 border-[#2a2a2a] text-gray-300 text-xs rounded-xl hover:bg-[#2a2a2a]/30 hover:text-white transition-all duration-200"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onToggle(product)}
                            className={`px-4 py-2 text-xs rounded-xl border-2 transition-all duration-200 ${product.isActive
                                    ? 'border-red-800/50 text-red-400 hover:bg-red-900/30 hover:border-red-700'
                                    : 'border-[#FF6B00]/50 text-[#FF6B00] hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]'
                                }`}
                        >
                            {product.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                            onClick={() => onDelete(product)}
                            className="px-4 py-2 border-2 border-red-600/50 text-red-500 text-xs rounded-xl hover:bg-red-900/30 hover:border-red-500 transition-all duration-200"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}