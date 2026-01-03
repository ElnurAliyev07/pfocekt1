const FileInputLoading = () => {
    return (
        <div className="mt-4 relative w-[200px] h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-md">
            {/* Loading Indicator */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px] z-10">
                <div className="relative w-8 h-8">
                    <div className="absolute inset-0 rounded-full border-2 border-neutral-200 opacity-25"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-neutral-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                </div>
            </div>

            {/* File Icon Skeleton */}
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 rounded-lg bg-neutral-300"></div>
                <div className="mt-3 w-24 h-4 bg-neutral-300 rounded"></div>
                <div className="mt-1 w-16 h-3 bg-neutral-300 rounded"></div>
            </div>

            {/* Type Badge Skeleton */}
            <div className="absolute top-3 left-3">
                <div className="w-16 h-6 bg-neutral-300 rounded-full"></div>
            </div>

            {/* Size Badge Skeleton */}
            <div className="absolute bottom-3 right-3">
                <div className="w-16 h-6 bg-neutral-300 rounded-full"></div>
            </div>
        </div>
    )
}

export default FileInputLoading;