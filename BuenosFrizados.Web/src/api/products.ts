import client from './client'
import { type Product } from '../types'

export const getProducts = async (includeInactive: boolean = false): Promise<Product[]> => {
    const url = includeInactive ? '/api/products?includeInactive=true' : '/api/products'
    const response = await client.get<Product[]>(url)
    return response.data
}

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await client.post<Product>('/api/products', product)
    return response.data
}

export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<void> => {
    await client.put(`/api/products/${id}`, product)
}

export const deleteProduct = async (id: number): Promise<void> => {
    await client.delete(`/api/products/${id}`)
}