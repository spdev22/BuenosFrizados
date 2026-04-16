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
        `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#378ADD] ${errors[field as keyof typeof errors] ? 'border-red-400' : 'border-[#dce8f5]'
        }`

    return (
        <div className="bg-white border border-[#dce8f5] rounded-xl p-5 flex flex-col gap-3">
            <p className="font-medium text-[#0c1a2e]">{product ? 'Edit product' : 'New product'}</p>
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
            <div className="flex gap-3 mt-2">
                <button onClick={handleSubmit}
                    className="flex-1 py-2.5 bg-[#378ADD] text-white rounded-lg text-sm font-medium hover:bg-[#185FA5] transition-colors">
                    {product ? 'Save changes' : 'Create product'}
                </button>
                <button onClick={onCancel}
                    className="flex-1 py-2.5 border border-[#dce8f5] text-[#0c1a2e] rounded-lg text-sm hover:bg-[#f4f7fb] transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    )
}