import { useEffect, useState } from 'react'
import type { Order, Product } from '../types'
import { getOrders, confirmOrder, deliverOrder, cancelOrder } from '../api/orders'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products'
import { useAdminAuth } from '../hooks/useAdminAuth'
import OrderList from '../components/orders/OrderList'
import ProductAdminList from '../components/products/ProductAdminList'
import ProductForm from '../components/products/ProductForm'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'
import PageHeader from '../components/shared/PageHeader'
import ConfirmModal from '../components/shared/ConfirmModal'

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { toast, showToast, hideToast } = useToast()
    const { logout } = useAdminAuth()

    const loadOrders = async (page: number = 1) => {
        try {
            const paginatedResponse = await getOrders(page, 10)
            setOrders(paginatedResponse.data)
            setTotalPages(paginatedResponse.totalPages)
        } catch {
            showToast('Error al cargar pedidos.', 'error')
        }
    }

    useEffect(() => {
        Promise.all([loadOrders(currentPage), getProducts(true)])
            .then(([, products]) => {
                setProducts(products)
            })
            .catch(() => showToast('Error al cargar datos.', 'error'))
            .finally(() => setLoading(false))
    }, [currentPage])

    const handleConfirm = async (id: number) => {
        try {
            await confirmOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Confirmed' } : o))
            showToast('Pedido confirmado.', 'primary')
        } catch {
            showToast('Error al confirmar pedido.', 'error')
        }
    }

    const handleDeliver = async (id: number) => {
        try {
            await deliverOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Delivered' } : o))
            showToast('Pedido marcado como entregado.', 'primary')
        } catch {
            showToast('Error al actualizar pedido.', 'error')
        }
    }

    const handleCancel = async (id: number) => {
        try {
            await cancelOrder(id)
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o))
            showToast('Pedido cancelado.', 'primary')
        } catch {
            showToast('Error al cancelar pedido.', 'error')
        }
    }

    const handleCreateProduct = async (data: Omit<Product, 'id' | 'isActive'>) => {
        try {
            const created = await createProduct({ ...data, isActive: true })
            setProducts(prev => [...prev, created])
            setShowForm(false)
            showToast('Producto creado.', 'primary')
        } catch {
            showToast('Error al crear producto.', 'error')
        }
    }

    const handleUpdateProduct = async (data: Omit<Product, 'id' | 'isActive'>) => {
        if (!editingProduct) return
        try {
            await updateProduct(editingProduct.id, { ...data, isActive: editingProduct.isActive })
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
            setEditingProduct(null)
            showToast('Producto actualizado.', 'primary')
        } catch {
            showToast('Error al actualizar producto.', 'error')
        }
    }

    const handleToggle = async (product: Product) => {
        try {
            await updateProduct(product.id, { ...product, isActive: !product.isActive })
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: !p.isActive } : p))
            showToast(product.isActive ? 'Producto desactivado.' : 'Producto activado.', 'primary')
        } catch {
            showToast('Error al actualizar producto.', 'error')
        }
    }

    const handleDelete = (product: Product) => {
        setProductToDelete(product)
    }

    const confirmDelete = async () => {
        if (!productToDelete) return
        try {
            await deleteProduct(productToDelete.id)
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id))
            showToast('Producto eliminado.', 'error')
        } catch {
            showToast('Error al eliminar producto.', 'error')
        } finally {
            setProductToDelete(null)
        }
    }

    const cancelDelete = () => {
        setProductToDelete(null)
    }

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-4">Cargando panel de administración...</p>
            </div>
        )
    }

    return (
        <div>
            <PageHeader title="Panel de Administración" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-2xl p-1 border border-[#2a2a2a]/60 shadow-xl">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'orders' ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Pedidos
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'products' ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Productos
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === 'products' && !showForm && !editingProduct && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-xl text-sm font-semibold hover:from-[#FF5500] hover:to-[#FF6B00] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            + Nuevo producto
                        </button>
                    )}
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 hover:text-red-300 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {activeTab === 'orders' && (
                <OrderList
                    orders={orders}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onConfirm={handleConfirm}
                    onDeliver={handleDeliver}
                    onCancel={handleCancel}
                    onPageChange={setCurrentPage}
                />
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
                        onDelete={handleDelete}
                    />
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
            <ConfirmModal
                isOpen={!!productToDelete}
                title="¿Eliminar producto?"
                message={`¿Estás seguro de eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    )
}