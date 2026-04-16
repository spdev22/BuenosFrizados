import { useState } from 'react'
import type { CreateOrderRequest, OrderItem } from '../../types'
import OrderItemComponent from './OrderItem'
import FieldError from '../shared/FieldError'
import { useFormValidation } from '../../hooks/useFormValidation'

interface OrderFormProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onSubmit: (order: CreateOrderRequest) => void
    onError: (message: string) => void
}

export default function OrderForm({ items, onRemove, onSubmit, onError }: OrderFormProps) {
    const [clientId, setClientId] = useState('')
    const [clientPhoneNumber, setClientPhoneNumber] = useState('')

    const { errors, validate, clearError } = useFormValidation<{
        clientId: string
        clientPhoneNumber: string
    }>({
        clientId: (v) => !v || Number(v) <= 0 ? 'Client ID is required' : null,
        clientPhoneNumber: (v) => !v ? 'Phone number is required' : v.length < 8 ? 'Phone number is too short' : null,
    })

    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

    const handleSubmit = () => {
        const valid = validate({ clientId, clientPhoneNumber })
        if (!valid) return
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
            <div className="bg-white border border-[#dce8f5] rounded-xl p-5">
                <p className="font-medium text-[#0c1a2e] mb-4">Your order</p>
                {items.map(item => (
                    <OrderItemComponent key={item.productId} item={item} onRemove={onRemove} />
                ))}
                <div className="flex justify-between pt-4 mt-2 border-t border-[#dce8f5] font-medium">
                    <span>Total</span>
                    <span className="text-[#185FA5]">${total.toLocaleString('es-AR')}</span>
                </div>
            </div>

            <div className="bg-white border border-[#dce8f5] rounded-xl p-5 flex flex-col gap-3">
                <p className="font-medium text-[#0c1a2e]">Client details</p>
                <div>
                    <input
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD] ${errors.clientId ? 'border-red-400' : 'border-[#dce8f5]'
                            }`}
                        placeholder="Client ID"
                        type="number"
                        value={clientId}
                        onChange={e => { setClientId(e.target.value); clearError('clientId') }}
                    />
                    <FieldError message={errors.clientId} />
                </div>
                <div>
                    <input
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD] ${errors.clientPhoneNumber ? 'border-red-400' : 'border-[#dce8f5]'
                            }`}
                        placeholder="Phone number"
                        value={clientPhoneNumber}
                        onChange={e => { setClientPhoneNumber(e.target.value); clearError('clientPhoneNumber') }}
                    />
                    <FieldError message={errors.clientPhoneNumber} />
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-auto w-full py-2.5 bg-[#378ADD] text-white rounded-lg text-sm font-medium hover:bg-[#185FA5] transition-colors"
                >
                    Confirm order
                </button>
            </div>
        </div>
    )
}