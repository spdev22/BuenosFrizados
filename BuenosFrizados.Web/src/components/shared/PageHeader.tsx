interface PageHeaderProps {
    title: string
    subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-4xl font-light text-white tracking-widest uppercase mb-2">
                {title}
            </h1>
            {subtitle && (
                <p className="text-sm font-extralight tracking-widest bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">{subtitle}</p>
            )}
        </div>
    )
}