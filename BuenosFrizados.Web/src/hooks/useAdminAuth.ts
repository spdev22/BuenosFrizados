import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = () => {
            const authStatus = localStorage.getItem('adminAuth') === 'true'
            setIsAuthenticated(authStatus)
            setIsLoading(false)
        }

        checkAuth()

        // Escuchar cambios en localStorage (para cuando se autentique en otra pestaña)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'adminAuth') {
                checkAuth()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const logout = () => {
        localStorage.removeItem('adminAuth')
        localStorage.removeItem('adminAttempts')
        localStorage.removeItem('adminBlockUntil')
        setIsAuthenticated(false)
        navigate('/menu')
    }

    const login = () => {
        localStorage.setItem('adminAuth', 'true')
        setIsAuthenticated(true)
    }

    return {
        isAuthenticated,
        isLoading,
        login,
        logout
    }
}