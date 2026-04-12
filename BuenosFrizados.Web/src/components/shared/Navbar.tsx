interface NavbarProps {
    currentPage: string
    onNavigate: (page: string) => void
    cartCount: number
}

export default function Navbar({ currentPage, onNavigate, cartCount }: NavbarProps) {
    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Buenos Frizados</span>
            <div className="flex gap-2">
                <button
                    onClick={() => onNavigate('menu')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === 'menu'
                            ? 'bg-teal-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Menu
                </button>
                <button
                    onClick={() => onNavigate('checkout')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === 'checkout'
                            ? 'bg-teal-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Order {cartCount > 0 && `(${cartCount})`}
                </button>
                <button
                    onClick={() => onNavigate('admin')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === 'admin'
                            ? 'bg-teal-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Admin
                </button>
            </div>
        </nav>
    )
}