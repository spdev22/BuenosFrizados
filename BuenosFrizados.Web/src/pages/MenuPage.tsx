import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { getProducts } from '../api/products'
import ProductList from '../components/products/ProductList'
import ProductCard from '../components/products/ProductCard'
import PageHeader from '../components/shared/PageHeader'

interface MenuPageProps {
    cartItems: Array<{ productId: number, quantity: number }>
    onAdd: (product: Product) => void
}

export default function MenuPage({ cartItems, onAdd }: MenuPageProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-4">Cargando menú...</p>
            </div>
        )
    }

    // Simular categorías por ahora basándose en el nombre
    const productos = products.filter(p =>
        p.name.toLowerCase().includes('baston') ||
        p.name.toLowerCase().includes('frizado') ||
        p.name.toLowerCase().includes('nugget') ||
        p.name.toLowerCase().includes('papa') ||
        p.name.toLowerCase().includes('hamburguesa')
    )

    const combos = products.filter(p =>
        p.name.toLowerCase().includes('combo') ||
        p.name.toLowerCase().includes('promo') ||
        p.name.toLowerCase().includes('menu')
    )

    return (
        <div>
            <PageHeader title="Nuestros Frizados" subtitle="Artesanal - Fresco - Cuidado" />

            {/* Sección Productos */}
            {productos.length > 0 && (
                <div className="mb-12">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productos.map(product => (
                            <ProductCard key={product.id} product={product} cartItems={cartItems} onAdd={onAdd} />
                        ))}
                    </div>
                </div>
            )}

            {/* Sección Combos */}
            {combos.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-light text-white tracking-wide uppercase mb-6">
                        <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                            Combos
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {combos.map(product => (
                            <ProductCard key={product.id} product={product} cartItems={cartItems} onAdd={onAdd} />
                        ))}
                    </div>
                </div>
            )}

            {/* Fallback si no hay productos categorizados */}
            {productos.length === 0 && combos.length === 0 && products.length > 0 && (
                <ProductList products={products} cartItems={cartItems} onAdd={onAdd} />
            )}

            {/* Mensaje si no hay productos */}
            {products.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-400">No hay productos disponibles</p>
                </div>
            )}
        </div>
    )
}