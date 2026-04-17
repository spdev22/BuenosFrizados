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
        clientId: (v) => !v || Number(v) <= 0 ? 'El ID del cliente es requerido' : null,
        clientPhoneNumber: (v) => !v ? 'El número de teléfono es requerido' : v.length < 8 ? 'El número de teléfono es muy corto' : null,
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
            <p className="text-center text-gray-400 py-12">Tu carrito está vacío. ¡Agregá productos desde el menú!</p>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 shadow-xl">
                <h2 className="font-semibold text-white text-xl mb-5 flex items-center gap-2">
                    <span className="w-1 h-10 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                    Tu pedido
                </h2>
                {items.map(item => (
                    <OrderItemComponent key={item.productId} item={item} onRemove={onRemove} />
                ))}
                <div className="flex justify-between pt-4 mt-4 border-t border-[#2a2a2a] font-semibold text-lg">
                    <span className="text-gray-300">Total</span>
                    <span className="text-[#FF6B00]">${total.toLocaleString('es-AR')}</span>
                </div>
            </div>

            <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                <h2 className="font-semibold text-white text-xl flex items-center gap-2">
                    <span className="w-1 h-10 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                    Datos del cliente
                </h2>
                <div>
                    <input
                        className={`w-full border-2 rounded-xl px-4 py-3 text-sm bg-[#0f0f0f]/70 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors ${errors.clientId ? 'border-red-400' : 'border-[#2a2a2a]'
                            }`}
                        placeholder="ID del cliente"
                        type="number"
                        value={clientId}
                        onChange={e => { setClientId(e.target.value); clearError('clientId') }}
                    />
                    <FieldError message={errors.clientId} />
                </div>
                <div>
                    <input
                        className={`w-full border-2 rounded-xl px-4 py-3 text-sm bg-[#0f0f0f]/70 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors ${errors.clientPhoneNumber ? 'border-red-400' : 'border-[#2a2a2a]'
                            }`}
                        placeholder="Número de teléfono"
                        value={clientPhoneNumber}
                        onChange={e => { setClientPhoneNumber(e.target.value); clearError('clientPhoneNumber') }}
                    />
                    <FieldError message={errors.clientPhoneNumber} />
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-auto w-full py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-xl text-sm font-semibold hover:from-[#FF5500] hover:to-[#FF6B00] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Confirmar pedido
                </button>
            </div>
        </div>
    )
}