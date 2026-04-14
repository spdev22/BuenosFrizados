import { useEffect } from 'react'

interface ToastProps {
    message: string
    type: 'error' | 'success'
    onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const styles = {
        error: 'bg-red-500 text-white',
        success: 'bg-[#185FA5] text-white'
    }

    return (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium shadow-lg flex items-center gap-3 ${styles[type]}`}>
            <span>{message}</span>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 text-base">✕</button>
        </div>
    )
}