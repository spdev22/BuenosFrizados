import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAdminAuth()

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Verificando acceso...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }

    return <>{children}</>
}