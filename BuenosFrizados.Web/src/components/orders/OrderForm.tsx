import { useState } from 'react'
import type { CreateOrderRequest, OrderItem } from '../../types'
import OrderItemComponent from './OrderItem'

interface OrderFormProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onSubmit: (order: CreateOrderRequest) => void
}

export default function OrderForm({ items, onRemove, onSubmit }: OrderFormProps) {
    const [clientId, setClientId] = useState('')
    const [clientPhoneNumber, setClientPhoneNumber] = useState('')

    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

    const handleSubmit = () => {
        if (!clientId || !clientPhoneNumber) {
            alert('Please fill in all fields')
            return
        }
        onSubmit({
            clientId: Number(clientId),
            clientPhoneNumber,
            items: items.map(i => ({
                productId: i.productId,
                productName: i.productName,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            }))
        })
    }

    if (items.length === 0) {
        return (
            <p className="text-center text-gray-400 py-12">Your cart is empty. Add products from the menu!</p>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="font-medium text-gray-900 mb-4">Your order</p>
                {items.map(item => (
                    <OrderItemComponent key={item.productId} item={item} onRemove={onRemove} />
                ))}
                <div className="flex justify-between pt-4 mt-2 border-t border-gray-200 font-medium">
                    <span>Total</span>
                    <span className="text-teal-600">${total.toLocaleString('es-AR')}</span>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                <p className="font-medium text-gray-900">Client details</p>
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="Client ID"
                    type="number"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                />
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="Phone number"
                    value={clientPhoneNumber}
                    onChange={e => setClientPhoneNumber(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="mt-auto w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                    Confirm order
                </button>
            </div>
        </div>
    )
}