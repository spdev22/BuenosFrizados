import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateOrderRequest, OrderItem } from '../types'
import { createOrder } from '../api/orders'
import OrderForm from '../components/orders/OrderForm'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'
import PageHeader from '../components/shared/PageHeader'

interface CheckoutPageProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onIncreaseQuantity: (productId: number) => void
    onDecreaseQuantity: (productId: number) => void
    onClearCart: () => void
}

export default function CheckoutPage({ items, onRemove, onIncreaseQuantity, onDecreaseQuantity, onClearCart }: CheckoutPageProps) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { toast, showToast, hideToast } = useToast()

    const handleSubmit = async (order: CreateOrderRequest) => {
        setLoading(true)
        try {
            await createOrder(order)
            onClearCart()
            showToast('¡Pedido realizado con éxito!', 'primary')
            setTimeout(() => navigate('/menu'), 2000)
        } catch (error) {
            showToast('Algo salió mal. Por favor intentá de nuevo.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    const minimumDelivery = 40000

    return (
        <div>
            <PageHeader title="Tu pedido" />

            {loading
                ? <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 mt-4">Realizando tu pedido...</p>
                </div>
                : <>
                    <OrderForm items={items} onRemove={onRemove} onIncreaseQuantity={onIncreaseQuantity} onDecreaseQuantity={onDecreaseQuantity} onSubmit={handleSubmit} onError={(message) => showToast(message, 'error')} />

                    {/* Delivery Information Notice */}
                    <div className="mt-6 p-4 bg-orange-500/10 backdrop-blur-sm rounded-lg border border-orange-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Delivery Option */}
                            <div className="flex items-start space-x-3">
                                <span className="text-orange-400 text-lg">🚚</span>
                                <div>
                                    <h4 className="text-orange-300 font-medium mb-1">Entrega a domicilio</h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        Zonas: <strong>Wilde, Quilmes y Bernal</strong>
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Pedido mínimo: <strong className="text-orange-300">${minimumDelivery.toLocaleString()}</strong>
                                    </p>
                                    {totalAmount > 0 && totalAmount < minimumDelivery && (
                                        <p className="text-red-400 text-sm mt-2 font-medium">
                                            ⚠️ Tu pedido (${totalAmount.toLocaleString()}) no alcanza el mínimo
                                        </p>
                                    )}
                                    {totalAmount >= minimumDelivery && (
                                        <p className="text-green-400 text-sm mt-2 font-medium">
                                            ✅ Califica para entrega
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Pickup Option */}
                            <div className="flex items-start space-x-3">
                                <span className="text-orange-400 text-lg">🏠</span>
                                <div>
                                    <h4 className="text-orange-300 font-medium mb-1">Retiro en domicilio</h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        <strong>Cerrito 1138, Bernal Oeste</strong>
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Sin mínimo de compra
                                    </p>
                                    {totalAmount > 0 && (
                                        <p className="text-green-400 text-sm mt-2 font-medium">
                                            ✅ Disponible para retiro
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}