import client from './client'
import type { Order, CreateOrderRequest, PaginatedResponse } from '../types'

export const getOrders = async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Order>> => {
    const response = await client.get<PaginatedResponse<Order>>(`/api/orders?page=${page}&pageSize=${pageSize}`)
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
    await client.post(`/api/orders/${id}/confirm`)
}

export const deliverOrder = async (id: number): Promise<void> => {
    await client.post(`/api/orders/${id}/deliver`)
}

export const cancelOrder = async (id: number): Promise<void> => {
    await client.post(`/api/orders/${id}/cancel`)
}