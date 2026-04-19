import type { CreateOrderRequest } from '../types'

export const WHATSAPP_NUMBER = '5491123215349' // TODO: Reemplazar con tu número de WhatsApp real

export function generateWhatsAppMessage(order: CreateOrderRequest, deliveryAddress?: string, deliveryDateTime?: string, clientName?: string): string {
    const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    let message = `🍕 *NUEVO PEDIDO - BUENOS FRIZADOS*\n\n`
    message += `👤 *Nombre:* ${clientName || 'No especificado'}\n`
    message += `📱 *Teléfono:* ${order.clientPhoneNumber}\n`
    message += `🏠 *Dirección de entrega:* ${deliveryAddress || 'No especificada'}\n`
    message += `🗓️ *Fecha de entrega:* ${deliveryDateTime || 'No especificada'}\n\n`
    message += `📝 *Detalle del pedido:*\n`

    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.productName}\n`
        message += `   💰 $${item.unitPrice.toLocaleString('es-AR')} x ${item.quantity}\n`
        message += `   💵 Subtotal: $${(item.unitPrice * item.quantity).toLocaleString('es-AR')}\n\n`
    })

    message += `💸 *TOTAL: $${total.toLocaleString('es-AR')}*\n\n`
    message += `⏰ Pedido realizado: ${new Date().toLocaleString('es-AR')}`

    return message
}

export function sendToWhatsApp(order: CreateOrderRequest, deliveryAddress?: string, deliveryDateTime?: string, clientName?: string): void {
    const message = generateWhatsAppMessage(order, deliveryAddress, deliveryDateTime, clientName)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
}