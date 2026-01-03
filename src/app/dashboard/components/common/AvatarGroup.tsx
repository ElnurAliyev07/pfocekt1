import Image from 'next/image'
import React from 'react'

interface AvatarGroupProps {
    images: string[]
    extraCount?: number 
}

const AvatarGroup: React.FC<AvatarGroupProps>  = ({images, extraCount}) => {
  return (
    <div className="flex items-center">
      {images.slice(0, 2).map((src, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white -ml-3 first:ml-0"
        >
          <Image width={500} height={500} src={src} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {extraCount && (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 -ml-3">
          +{extraCount}
        </div>
      )}
    </div>
  )
}

export default AvatarGroup 