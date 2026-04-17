interface PageHeaderProps {
    title: string
    subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="w-1 h-10 bg-gradient-to-b from-[#FF6B00] to-[#FF8533] rounded-full"></span>
                {title}
            </h1>
            {subtitle && (
                <p className="text-gray-400 mt-2 ml-7">{subtitle}</p>
            )}
        </div>
    )
}