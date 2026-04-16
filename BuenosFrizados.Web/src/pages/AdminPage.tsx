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
        return (
            <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-4">Loading admin panel...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-1 h-10 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                    Admin Panel
                </h1>
                <p className="text-gray-400 mt-2 ml-7">Manage orders and products</p>
            </div>
            
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-2xl p-1 border border-[#2a2a2a]/60 shadow-xl">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'orders' ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'products' ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Products
                    </button>
                </div>
                {activeTab === 'products' && !showForm && !editingProduct && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-xl text-sm font-semibold hover:from-[#FF5500] hover:to-[#FF6B00] transition-all duration-200 shadow-lg hover:shadow-xl"
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