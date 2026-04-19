import type { Product } from '../../types'
import ProductCard from './ProductCard'

interface ProductListProps {
    products: Product[]
    cartItems: Array<{ productId: number, quantity: number }>
    onAdd: (product: Product) => void
}

export default function ProductList({ products, cartItems, onAdd }: ProductListProps) {
    if (products.length === 0) {
        return (
            <p className="text-center text-gray-400 py-12">No hay productos disponibles</p>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
                <ProductCard key={product.id} product={product} cartItems={cartItems} onAdd={onAdd} />
            ))}
        </div>
    )
}