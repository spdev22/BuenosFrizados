import { useEffect, useState } from 'react'
import type { Order, Product } from '../types'
import { getOrders, confirmOrder, deliverOrder, cancelOrder } from '../api/orders'
import { getProducts, createProduct, updateProduct } from '../api/products'
import OrderList from '../components/orders/OrderList'
import ProductAdminList from '../components/products/ProductAdminList'
import ProductForm from '../components/products/ProductForm'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [showForm, setShowForm] = useState(false)
    const { toast, showToast, hideToast } = useToast()

    useEffect(() => {
        Promise.all([getOrders(), getProducts()])
            .then(([orders, products]) => {
                setOrders(orders)
                setProducts(products)
            })
            .catch(() => showToast('Failed to load data.', 'error'))
            .finally(() => setLoading(false))
    }, [])

    const handleConfirm = async (id: number) => {
        try {
            await confirmOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Confirmed' } : o))
            showToast('Order confirmed.', 'success')
        } catch {
            showToast('Failed to confirm order.', 'error')
        }
    }

    const handleDeliver = async (id: number) => {
        try {
            await deliverOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Delivered' } : o))
            showToast('Order marked as delivered.', 'success')
        } catch {
            showToast('Failed to update order.', 'error')
        }
    }

    const handleCancel = async (id: number) => {
        try {
            await cancelOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o))
            showToast('Order cancelled.', 'success')
        } catch {
            showToast('Failed to cancel order.', 'error')
        }
    }

    const handleCreateProduct = async (data: Omit<Product, 'id' | 'isActive'>) => {
        try {
            const created = await createProduct({ ...data, isActive: true })
            setProducts(prev => [...prev, created])
            setShowForm(false)
            showToast('Product created.', 'success')
        } catch {
            showToast('Failed to create product.', 'error')
        }
    }

    const handleUpdateProduct = async (data: Omit<Product, 'id' | 'isActive'>) => {
        if (!editingProduct) return
        try {
            await updateProduct(editingProduct.id, { ...data, isActive: editingProduct.isActive })
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
            setEditingProduct(null)
            showToast('Product updated.', 'success')
        } catch {
            showToast('Failed to update product.', 'error')
        }
    }

    const handleToggle = async (product: Product) => {
        try {
            await updateProduct(product.id, { ...product, isActive: !product.isActive })
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: !p.isActive } : p))
            showToast(product.isActive ? 'Product deactivated.' : 'Product activated.', 'success')
        } catch {
            showToast('Failed to update product.', 'error')
        }
    }

    if (loading) {
        return <p className="text-center text-gray-400 py-12">Loading...</p>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'orders' ? 'bg-[#0c1a2e] text-white' : 'text-gray-500 hover:bg-[#f4f7fb]'
                            }`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'products' ? 'bg-[#0c1a2e] text-white' : 'text-gray-500 hover:bg-[#f4f7fb]'
                            }`}
                    >
                        Products
                    </button>
                </div>
                {activeTab === 'products' && !showForm && !editingProduct && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-[#378ADD] text-white rounded-lg text-sm font-medium hover:bg-[#185FA5] transition-colors"
                    >
                        + New product
                    </button>
                )}
            </div>

            {activeTab === 'orders' && (
                <OrderList orders={orders} onConfirm={handleConfirm} onDeliver={handleDeliver} onCancel={handleCancel} />
            )}

            {activeTab === 'products' && (
                <div className="flex flex-col gap-4">
                    {showForm && (
                        <ProductForm
                            onSubmit={handleCreateProduct}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                    {editingProduct && (
                        <ProductForm
                            product={editingProduct}
                            onSubmit={handleUpdateProduct}
                            onCancel={() => setEditingProduct(null)}
                        />
                    )}
                    <ProductAdminList
                        products={products}
                        onEdit={setEditingProduct}
                        onToggle={handleToggle}
                    />
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}