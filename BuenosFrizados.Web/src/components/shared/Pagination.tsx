interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const getVisiblePages = () => {
        const pages: number[] = []
        const maxVisible = 5
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, 5)
            } else if (currentPage >= totalPages - 2) {
                pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2)
            }
        }
        
        return pages
    }

    const visiblePages = getVisiblePages()

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                ←
            </button>
            
            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        currentPage === page
                            ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]/30'
                    }`}
                >
                    {page}
                </button>
            ))}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                →
            </button>
        </div>
    )
}