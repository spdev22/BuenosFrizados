import { useState } from 'react'
import type { Product } from '../../types'
import FieldError from '../shared/FieldError'
import { useFormValidation } from '../../hooks/useFormValidation'

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

    const { errors, validate, clearError } = useFormValidation<{
        name: string
        description: string
        price: string
        imageUrl: string
    }>({
        name: (v) => !v ? 'Name is required' : null,
        description: (v) => !v ? 'Description is required' : null,
        price: (v) => !v || Number(v) <= 0 ? 'Price must be greater than 0' : null,
        imageUrl: (v) => !v ? 'Image URL is required' : null,
    })

    const handleSubmit = () => {
        const valid = validate({ name, description, price, imageUrl })
        if (!valid) return
        onSubmit({ name, description, price: Number(price), imageUrl })
    }

    const inputClass = (field: string) =>
        `w-full border-2 rounded-xl px-4 py-3 text-sm bg-[#0f0f0f]/70 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] transition-colors ${errors[field as keyof typeof errors] ? 'border-red-400' : 'border-[#2a2a2a]'
        }`

    return (
        <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="font-semibold text-white text-xl flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                {product ? 'Edit product' : 'New product'}
            </h2>
            <div>
                <input className={inputClass('name')} placeholder="Name" value={name}
                    onChange={e => { setName(e.target.value); clearError('name') }} />
                <FieldError message={errors.name} />
            </div>
            <div>
                <input className={inputClass('description')} placeholder="Description" value={description}
                    onChange={e => { setDescription(e.target.value); clearError('description') }} />
                <FieldError message={errors.description} />
            </div>
            <div>
                <input className={inputClass('price')} placeholder="Price" type="number" value={price}
                    onChange={e => { setPrice(e.target.value); clearError('price') }} />
                <FieldError message={errors.price} />
            </div>
            <div>
                <input className={inputClass('imageUrl')} placeholder="Image URL" value={imageUrl}
                    onChange={e => { setImageUrl(e.target.value); clearError('imageUrl') }} />
                <FieldError message={errors.imageUrl} />
            </div>
            <div className="flex gap-4 mt-2">
                <button onClick={handleSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-xl text-sm font-semibold hover:from-[#FF5500] hover:to-[#FF6B00] transition-all duration-200 shadow-lg hover:shadow-xl">
                    {product ? 'Save changes' : 'Create product'}
                </button>
                <button onClick={onCancel}
                    className="flex-1 py-3 border-2 border-[#2a2a2a] text-gray-300 rounded-xl text-sm font-medium hover:bg-[#2a2a2a]/30 hover:text-white transition-all duration-200">
                    Cancel
                </button>
            </div>
        </div>
    )
}