import { useState } from 'react'
import type { Product } from '../../types'

interface ProductFormProps {
    product?: Product
    onSubmit: (product: Omit<Product, 'id' | 'isActive'>) => void
    onCancel: () => void
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [name, setName] = useState(product?.name ?? '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [price, setPrice] = useState(product?.price.toString() ?? '')
    const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '')

    const handleSubmit = () => {
        if (!name || !description || !price || !imageUrl) {
            return
        }
        onSubmit({ name, description, price: Number(price), imageUrl })
    }

    return (
        <div className="bg-white border border-[#dce8f5] rounded-xl p-5 flex flex-col gap-4">
            <p className="font-medium text-[#0c1a2e]">{product ? 'Edit product' : 'New product'}</p>
            <input
                className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD]"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD]"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <input
                className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD]"
                placeholder="Price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <input
                className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD]"
                placeholder="Image URL"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
            />
            <div className="flex gap-3 mt-2">
                <button
                    onClick={handleSubmit}
                    className="flex-1 py-2.5 bg-[#378ADD] text-white rounded-lg text-sm font-medium hover:bg-[#185FA5] transition-colors"
                >
                    {product ? 'Save changes' : 'Create product'}
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 border border-[#dce8f5] text-[#0c1a2e] rounded-lg text-sm hover:bg-[#f4f7fb] transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}