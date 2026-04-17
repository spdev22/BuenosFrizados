import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { getProducts } from '../api/products'
import ProductList from '../components/products/ProductList'
import PageHeader from '../components/shared/PageHeader'

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
                <p className="text-gray-400 mt-4">Cargando menú...</p>
            </div>
        )
    }

    return (
        <div>
            <PageHeader title="Menú" subtitle="Delicious artisanal fries and more" />
            <ProductList products={products} onAdd={onAdd} />
        </div>
    )
}