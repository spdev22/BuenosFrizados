import { useNavigate, useLocation } from 'react-router-dom'

interface NavbarProps {
    cartCount: number
}

export default function Navbar({ cartCount }: NavbarProps) {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    return (
        <nav className="bg-white border-b border-[#dce8f5] px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Buenos Frizados</span>
            <div className="flex gap-2">
                <button
                    onClick={() => navigate('/menu')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/menu') ? 'bg-[#378ADD] text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Menu
                </button>
                <button
                    onClick={() => navigate('/order')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/order') ? 'bg-[#378ADD] text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Order {cartCount > 0 && `(${cartCount})`}
                </button>
                <button
                    onClick={() => navigate('/admin')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin') ? 'bg-[#378ADD] text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Admin
                </button>
            </div>
        </nav>
    )
}