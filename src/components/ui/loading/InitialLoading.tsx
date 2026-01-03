import React from 'react'

const InitialLoading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-3000">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  )
}

export default InitialLoading