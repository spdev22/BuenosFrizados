interface FieldErrorProps {
    message?: string
}

export default function FieldError({ message }: FieldErrorProps) {
    if (!message) return null
    return (
        <p className="text-red-500 text-xs mt-1">{message}</p>
    )
}