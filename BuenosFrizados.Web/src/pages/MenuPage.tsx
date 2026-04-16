import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { getProducts } from '../api/products'
import ProductList from '../components/products/ProductList'

interface MenuPageProps {
    onAdd: (product: Product) => void
}

export default function MenuPage({ onAdd }: MenuPageProps) {
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
                <p className="text-gray-400 mt-4">Loading menu...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-1 h-10 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                    Menu
                </h1>
                <p className="text-gray-400 mt-2 ml-7">Delicious artisanal fries and more</p>
            </div>
            <ProductList products={products} onAdd={onAdd} />
        </div>
    )
}