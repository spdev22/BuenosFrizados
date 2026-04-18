import { useState, useRef } from 'react'
import type { CreateOrderRequest, OrderItem } from '../../types'
import OrderItemComponent from './OrderItem'
import FieldError from '../shared/FieldError'
import { useFormValidation } from '../../hooks/useFormValidation'
import { sendToWhatsApp } from '../../utils/whatsapp'
import { FaWhatsapp } from 'react-icons/fa'

interface OrderFormProps {
    items: OrderItem[]
    onRemove: (productId: number) => void
    onSubmit: (order: CreateOrderRequest) => void
    onError: (message: string) => void
}

export default function OrderForm({ items, onRemove, onSubmit }: OrderFormProps) {
    const [clientName, setClientName] = useState('')
    const [clientPhoneNumber, setClientPhoneNumber] = useState('')
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const dateInputRef = useRef<HTMLInputElement>(null)

    // Días de la semana permitidos (0 = domingo, 1 = lunes, ... 6 = sábado)
    const allowedDays = [1, 5] // martes a sábado

    const getNextAvailableDate = () => {
        const today = new Date()
        let nextDate = new Date(today)
        nextDate.setDate(today.getDate() + 1) // empezar desde mañana

        // Encontrar el próximo día permitido
        while (!allowedDays.includes(nextDate.getDay())) {
            nextDate.setDate(nextDate.getDate() + 1)
        }

        const year = nextDate.getFullYear()
        const month = (nextDate.getMonth() + 1).toString().padStart(2, '0')
        const day = nextDate.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const isDateAllowed = (dateStr: string) => {
        if (!dateStr) return false
        const date = new Date(dateStr + 'T00:00:00')
        return allowedDays.includes(date.getDay())
    }

    const { errors, validate, clearError } = useFormValidation<{
        clientName: string
        clientPhoneNumber: string
        deliveryAddress: string
        deliveryDate: string
    }>({
        clientName: (v) => !v ? 'El nombre es requerido' : null,
        clientPhoneNumber: (v) => !v ? 'El número de teléfono es requerido' : v.length < 8 ? 'El número de teléfono es muy corto' : null,
        deliveryAddress: (v) => !isDeliveryEligible ? null : !v ? 'La dirección de entrega es requerida' : null,
        deliveryDate: (v) => !v ? null : !isDateAllowed(v) ? 'Por favor, eliga una fecha que sea lunes o viernes' : null,
    })

    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    const minimumDelivery = 40000
    const isDeliveryEligible = total >= minimumDelivery

    const handleSubmit = () => {
        const valid = validate({ clientName, clientPhoneNumber, deliveryAddress, deliveryDate })
        if (!valid) return

        const orderData: CreateOrderRequest = {
            clientId: 1, // ID por defecto
            clientPhoneNumber,
            items: items.map(i => ({
                productId: i.productId,
                productName: i.productName,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            }))
        }

        // Enviar a WhatsApp con dirección, fecha y nombre
        sendToWhatsApp(orderData, deliveryAddress, deliveryDate, clientName)

        // Registrar en el sistema
        onSubmit(orderData)
    }

    if (items.length === 0) {
        return (
            <p className="text-center text-gray-400 py-12">Tu carrito está vacío. ¡Agregá productos desde el menú!</p>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 shadow-xl">

                {items.map(item => (
                    <OrderItemComponent key={item.productId} item={item} onRemove={onRemove} />
                ))}
                <div className="flex justify-between pt-4 mt-4 border-t border-[#2a2a2a] font-semibold text-lg">
                    <span className="text-gray-300">Total</span>
                    <span className="text-[#FF6B00]">${total.toLocaleString('es-AR')}</span>
                </div>
            </div>

            <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Datos del cliente</label>
                    <input
                        className={`w-full border-2 rounded-xl px-4 py-3 text-sm bg-[#0f0f0f]/70 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors ${errors.clientName ? 'border-red-400' : 'border-[#2a2a2a]'
                            }`}
                        placeholder="Nombre completo"
                        value={clientName}
                        onChange={e => { setClientName(e.target.value); clearError('clientName') }}
                    />
                    <FieldError message={errors.clientName} />
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
                <div>
                    <input
                        className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                            !isDeliveryEligible 
                                ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed opacity-60' 
                                : errors.deliveryAddress 
                                    ? 'border-red-400 bg-[#0f0f0f]/70' 
                                    : 'border-[#2a2a2a] bg-[#0f0f0f]/70 focus:border-[#FF6B00]'
                        }`}
                        placeholder={isDeliveryEligible ? "Dirección de entrega" : "Dirección de entrega (mínimo $40.000)"}
                        value={deliveryAddress}
                        onChange={e => { setDeliveryAddress(e.target.value); clearError('deliveryAddress') }}
                        disabled={!isDeliveryEligible}
                    />
                    {!isDeliveryEligible && (
                        <p className="text-xs text-gray-400 mt-1">
                            ⚠️ Agregá ${(minimumDelivery - total).toLocaleString()} más para habilitar entrega a domicilio
                        </p>
                    )}
                    <FieldError message={errors.deliveryAddress} />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Fecha de entrega</label>
                    <div
                        className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-white cursor-pointer transition-colors ${
                            errors.deliveryDate 
                                ? 'border-red-400 bg-[#0f0f0f]/70' 
                                : 'border-[#2a2a2a] bg-[#0f0f0f]/70 hover:border-[#FF6B00]'
                        }`}
                        onClick={() => dateInputRef.current?.showPicker?.()}
                    >
                        {deliveryDate ? new Date(deliveryDate + 'T00:00:00').toLocaleDateString('es-AR') : 'Seleccionar fecha'}
                    </div>
                    <input
                        ref={dateInputRef}
                        type="date"
                        className="sr-only"
                        value={deliveryDate}
                        onChange={e => {
                            const selectedDate = e.target.value
                            if (isDateAllowed(selectedDate)) {
                                setDeliveryDate(selectedDate)
                                clearError('deliveryDate')
                            } else {
                                // No cambiar el valor, pero mostrar error
                                validate({ clientName, clientPhoneNumber, deliveryAddress, deliveryDate: selectedDate })
                            }
                        }}
                        min={getNextAvailableDate()}
                    />
                    <FieldError message={errors.deliveryDate} />
                </div>
                <p className="text-xs text-gray-500 mt-1">* Por el momento solo entregamos los dias lunes y viernes  </p>

                <button
                    onClick={handleSubmit}
                    className="mt-auto w-full py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-semibold hover:from-[#20B858] hover:to-[#0F7A6B] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                    <FaWhatsapp className="text-lg" />
                    Confirmar y enviar por WhatsApp
                </button>
            </div>
        </div>
    )
}