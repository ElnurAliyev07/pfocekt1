const SkeletonWorkspaceItem: React.FC = () => {
    return (
      <div className="skeleton-item bg-gray-200 animate-pulse p-4 rounded-md">
        <div className="h-24 bg-gray-300 rounded-md mb-4"></div> {/* Placeholder for image */}
        <div className="h-4 bg-gray-300 rounded-md mb-2"></div> {/* Placeholder for title */}
        <div className="h-4 bg-gray-300 rounded-md w-3/4"></div> {/* Placeholder for subtitle */}
      </div>
    )
  }
  
  export default SkeletonWorkspaceItem