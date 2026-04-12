import client from './client'
import type { Order, CreateOrderRequest } from '../types'

export const getOrders = async (): Promise<Order[]> => {
    const response = await client.get<Order[]>('/api/orders')
    return response.data
}

export const getOrder = async (id: number): Promise<Order> => {
    const response = await client.get<Order>(`/api/orders/${id}`)
    return response.data
}

export const createOrder = async (order: CreateOrderRequest): Promise<Order> => {
    const response = await client.post<Order>('/api/orders', order)
    return response.data
}

export const confirmOrder = async (id: number): Promise<void> => {
    await client.patch(`/api/orders/${id}/confirm`)
}

export const deliverOrder = async (id: number): Promise<void> => {
    await client.patch(`/api/orders/${id}/deliver`)
}