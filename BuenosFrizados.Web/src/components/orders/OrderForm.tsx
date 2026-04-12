import { useState } from 'react'
import type { CreateOrderRequest, OrderItem } from '../../types'
import OrderItemComponent from './OrderItem'

interface OrderFormProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onSubmit: (order: CreateOrderRequest) => void
}

export default function OrderForm({ items, onRemove, onSubmit }: OrderFormProps) {
    const [customerName, setCustomerName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const [deliveryTime, setDeliveryTime] = useState('10:00 - 12:00')
    const [paymentMethod, setPaymentMethod] = useState('Bank transfer')

    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

    const handleSubmit = () => {
        if (!customerName || !address || !phone || !deliveryDate) {
            alert('Please fill in all fields')
            return
        }
        onSubmit({ customerName, address, phone, deliveryDate, deliveryTime, paymentMethod, items })
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
                <p className="font-medium text-gray-900">Delivery details</p>
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="Full name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                />
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="Phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                />
                <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                >
                    <option>10:00 - 12:00</option>
                    <option>12:00 - 14:00</option>
                    <option>14:00 - 16:00</option>
                    <option>16:00 - 18:00</option>
                    <option>18:00 - 20:00</option>
                </select>
                <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                >
                    <option>Bank transfer</option>
                    <option>Mercado Pago</option>
                    <option>Cash on delivery</option>
                </select>
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