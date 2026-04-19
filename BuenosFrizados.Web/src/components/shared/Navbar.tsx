import { useNavigate, useLocation } from 'react-router-dom'

interface NavbarProps {
    cartCount: number
}

export default function Navbar({ cartCount }: NavbarProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const isActive = (path: string) => location.pathname === path

    return (
        <nav className="bg-[#1a1a1a]/40 backdrop-blur-sm border-b border-[#2a2a2a]/40 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-[#FF6B00] rounded-full" />
                <div>
                    <p className="text-white font-bold text-lg tracking-wide leading-none">BUENOS</p>
                    <p className="text-[#FF6B00] font-light text-sm tracking-[0.3em] leading-none mt-0.5">FRIZADOS</p>
                    <p className="text-[#444] text-[9px] tracking-[0.15em] mt-1"> FRIZADOS ARTESANALES </p>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => navigate('/menu')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isActive('/menu') ? 'bg-[#FF6B00] text-white' : 'text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                        }`}
                >
                    Menú
                </button>
                <button
                    onClick={() => navigate('/order')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isActive('/order') ? 'bg-[#FF6B00] text-white' : 'text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                        }`}
                >
                    Pedido {cartCount > 0 && `(${cartCount})`}
                </button>
            </div>
        </nav>
    )
}