/* eslint-disable react/prop-types */

export function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
    const sizeClasses = {
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-4">
            <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></span>
            {message && <p className="text-sm text-gray-500">{message}</p>}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="card bg-base-100 shadow-sm animate-pulse">
            <div className="card-body">
                <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-base-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-base-300 rounded w-full"></div>
            </div>
        </div>
    );
}

export function SkeletonWidget() {
    return (
        <div className="bg-base-100 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-base-300 rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                    <div className="h-3 bg-base-300 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonAlert() {
    return (
        <div className="bg-base-100 rounded-lg p-3 animate-pulse">
            <div className="flex justify-between items-start mb-2">
                <div className="h-4 bg-base-300 rounded w-2/3"></div>
                <div className="h-3 bg-base-300 rounded-full w-12"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-base-300 rounded w-full"></div>
                <div className="h-3 bg-base-300 rounded w-4/5"></div>
            </div>
        </div>
    );
}

export function SkeletonMap() {
    return (
        <div className="w-full h-full bg-base-300 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-2 text-sm text-gray-500">Loading map...</p>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i}>
                                <div className="h-4 bg-base-300 rounded w-20 animate-pulse"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <td key={colIndex}>
                                    <div className="h-3 bg-base-300 rounded w-full animate-pulse"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function LoadingOverlay({ message = 'Processing...' }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-6 shadow-xl">
                <LoadingSpinner size="lg" message={message} />
            </div>
        </div>
    );
}

export function EmptyState({ icon = 'fa-inbox', message = 'No data available', action }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <i className={`fa-solid ${icon} text-5xl text-gray-400 mb-4`}></i>
            <p className="text-lg text-gray-500 mb-4">{message}</p>
            {action && (
                <button onClick={action.onClick} className="btn btn-primary btn-sm">
                    {action.label}
                </button>
            )}
        </div>
    );
}
