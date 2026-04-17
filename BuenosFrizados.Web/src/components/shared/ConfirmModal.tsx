interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    confirmText = "Confirmar", 
    cancelText = "Cancelar", 
    onConfirm, 
    onCancel 
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a]/95 backdrop-blur-sm border border-[#2a2a2a]/80 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                        {title}
                    </h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                    {message}
                </p>
                
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 border-2 border-[#2a2a2a] text-gray-300 rounded-xl text-sm font-medium hover:bg-[#2a2a2a]/30 hover:text-white transition-all duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}