export interface Product {
    id: number
    name: string
    description: string
    price: number
    emoji: string
    isActive: boolean
}

export interface OrderItem {
    productId: number
    productName: string
    quantity: number
    unitPrice: number
}

export interface Order {
    id: number
    customerName: string
    address: string
    phone: string
    deliveryDate: string
    deliveryTime: string
    paymentMethod: string
    total: number
    status: string
    createdAt: string
    items: OrderItem[]
}

export interface CreateOrderRequest {
    customerName: string
    address: string
    phone: string
    deliveryDate: string
    deliveryTime: string
    paymentMethod: string
    items: OrderItem[]
}