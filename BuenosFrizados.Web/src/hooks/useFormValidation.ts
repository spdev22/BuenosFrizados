import { useState } from 'react'

type Rules<T> = Partial<Record<keyof T, (value: string) => string | null>>

export function useFormValidation<T extends Record<string, string>>(rules: Rules<T>) {
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

    const validate = (data: T): boolean => {
        const newErrors: Partial<Record<keyof T, string>> = {}
        let valid = true

        for (const key in rules) {
            const rule = rules[key]
            const error = rule?.(data[key] ?? '')
            if (error) {
                newErrors[key] = error
                valid = false
            }
        }

        setErrors(newErrors)
        return valid
    }

    const clearError = (field: keyof T) => {
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    return { errors, validate, clearError }
}