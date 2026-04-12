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
        return <p className="text-center text-gray-400 py-12">Loading...</p>
    }

    return (
        <div>
            <h1 className="text-xl font-medium text-gray-900 mb-6">Menu</h1>
            <ProductList products={products} onAdd={onAdd} />
        </div>
    )
}