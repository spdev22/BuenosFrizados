export interface Product {
    id: number
    name: string
    description: string
    price: number
    imageUrl: string
    isActive: boolean
}

export interface OrderItem {
    productId: number
    productName: string
    quantity: number
    unitPrice: number
    imageUrl?: string
}

export interface Order {
    id: number
    clientId: number
    clientPhoneNumber: string
    orderDate: string
    total: number
    status: string
    items: OrderItem[]
}

export interface CreateOrderRequest {
    clientId: number
    clientPhoneNumber: string
    items: CreateOrderItemRequest[]
}

export interface CreateOrderItemRequest {
    productId: number
    productName: string
    quantity: number
    unitPrice: number
}