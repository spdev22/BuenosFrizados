import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateAdminPin } from '../api/admin'
import PageHeader from '../components/shared/PageHeader'
import Toast from '../components/shared/Toast'
import { useToast } from '../hooks/useToast'

export default function AdminLoginPage() {
    const [pin, setPin] = useState('')
    const [attempts, setAttempts] = useState(0)
    const [isBlocked, setIsBlocked] = useState(false)
    const [blockTimeLeft, setBlockTimeLeft] = useState(0)
    const [isValidating, setIsValidating] = useState(false)
    const navigate = useNavigate()
    const { toast, showToast, hideToast } = useToast()

    const MAX_ATTEMPTS = 3
    const BLOCK_TIME = 30 // 30 segundos de bloqueo

    useEffect(() => {
        // Verificar si ya está autenticado
        if (localStorage.getItem('adminAuth') === 'true') {
            navigate('/admin')
        }

        // Verificar si está bloqueado
        const blockUntil = localStorage.getItem('adminBlockUntil')
        if (blockUntil) {
            const timeLeft = parseInt(blockUntil) - Date.now()
            if (timeLeft > 0) {
                setIsBlocked(true)
                setBlockTimeLeft(Math.ceil(timeLeft / 1000))
                
                const interval = setInterval(() => {
                    const remaining = parseInt(blockUntil) - Date.now()
                    if (remaining <= 0) {
                        setIsBlocked(false)
                        setAttempts(0)
                        localStorage.removeItem('adminBlockUntil')
                        clearInterval(interval)
                    } else {
                        setBlockTimeLeft(Math.ceil(remaining / 1000))
                    }
                }, 1000)

                return () => clearInterval(interval)
            } else {
                localStorage.removeItem('adminBlockUntil')
            }
        }
    }, [navigate])

    const handlePinChange = (value: string) => {
        if (isBlocked) return
        if (value.length <= 6 && /^\d*$/.test(value)) {
            setPin(value)
        }
    }

    const handleSubmit = async () => {
        if (isBlocked || isValidating) return

        setIsValidating(true)
        try {
            const result = await validateAdminPin(pin)
            
            if (result.success) {
                localStorage.setItem('adminAuth', 'true')
                localStorage.removeItem('adminAttempts')
                localStorage.removeItem('adminBlockUntil')
                showToast('¡Acceso concedido!', 'primary')
                setTimeout(() => navigate('/admin'), 1000)
            } else {
                const newAttempts = attempts + 1
                setAttempts(newAttempts)
                localStorage.setItem('adminAttempts', newAttempts.toString())

                if (newAttempts >= MAX_ATTEMPTS) {
                    const blockUntil = Date.now() + (BLOCK_TIME * 1000)
                    localStorage.setItem('adminBlockUntil', blockUntil.toString())
                    setIsBlocked(true)
                    setBlockTimeLeft(BLOCK_TIME)
                    showToast(`Demasiados intentos. Bloqueado por ${BLOCK_TIME} segundos.`, 'error')
                    setPin('')
                    
                    const interval = setInterval(() => {
                        const remaining = blockUntil - Date.now()
                        if (remaining <= 0) {
                            setIsBlocked(false)
                            setAttempts(0)
                            localStorage.removeItem('adminBlockUntil')
                            clearInterval(interval)
                        } else {
                            setBlockTimeLeft(Math.ceil(remaining / 1000))
                        }
                    }, 1000)
                } else {
                    showToast(`PIN incorrecto. Te quedan ${MAX_ATTEMPTS - newAttempts} intentos.`, 'error')
                    setPin('')
                }
            }
        } catch (error) {
            showToast('Error de conexión. Intentá de nuevo.', 'error')
        } finally {
            setIsValidating(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-md">
                <PageHeader title="Acceso de Administrador" />
                
                <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a]/80 rounded-2xl p-8 shadow-xl">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-orange-400 text-2xl">🔒</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-200 mb-2">Ingresá tu PIN</h2>
                        <p className="text-gray-400 text-sm">
                            {isBlocked 
                                ? `Acceso bloqueado. Esperá ${blockTimeLeft}s`
                                : `PIN de 4 dígitos`
                            }
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => handlePinChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="••••••"
                                disabled={isBlocked}
                                className={`w-full text-center text-2xl tracking-[0.5em] border-2 rounded-xl px-4 py-4 bg-[#0f0f0f]/70 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                                    isBlocked 
                                        ? 'border-red-500/50 cursor-not-allowed opacity-50'
                                        : 'border-[#2a2a2a] focus:border-[#FF6B00]'
                                }`}
                                maxLength={6}
                                autoComplete="off"
                                autoFocus={!isBlocked}
                            />
                            {attempts > 0 && !isBlocked && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-red-400 text-sm">
                                        {attempts}/{MAX_ATTEMPTS}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isBlocked || pin.length === 0 || isValidating}
                            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                                isBlocked || pin.length === 0 || isValidating
                                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:from-[#FF5500] hover:to-[#FF7722] shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isBlocked 
                                ? `Bloqueado (${blockTimeLeft}s)`
                                : isValidating
                                    ? 'Validando...'
                                    : 'Ingresar'
                            }
                        </button>
                    </div>

                    {attempts > 0 && !isBlocked && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-300 text-sm text-center">
                                ⚠️ Intentos fallidos: {attempts}/{MAX_ATTEMPTS}
                            </p>
                        </div>
                    )}
                </div>
                
                {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
            </div>
        </div>
    )
}