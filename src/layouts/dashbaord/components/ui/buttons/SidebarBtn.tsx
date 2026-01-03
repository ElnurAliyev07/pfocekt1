import React from 'react'

const SidebarBtn = ({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) => {
  return (
    <div className="absolute -right-6 top-[80px] z-[999] transform -translate-y-1/2">
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            className="group outline-none focus:outline-none relative cursor-pointer"
          >
            {/* Glow effect */}
            <div className={`
              absolute inset-0 
              bg-gradient-to-r from-violet-500 to-purple-500 
              rounded-2xl 
              blur-md 
              opacity-0 
              group-hover:opacity-60 
              transition-all duration-500 
              scale-110
            `} />
            
            {/* Main button container */}
            <div className={`
              relative
              w-5 h-10
              flex items-center justify-center
              bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600
              border border-white/20
              rounded-2xl
              shadow-2xl
              transition-all duration-500 ease-out
              group-hover:shadow-violet-500/50 
              group-hover:shadow-2xl
              group-hover:scale-110
              group-active:scale-95
              backdrop-blur-sm
              ${!open ? "rotate-180" : ""}
            `}>
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              
              {/* Animated chevron */}
              <div className="relative z-10">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`
                    transition-all duration-500 ease-out
                    group-hover:scale-110
                    drop-shadow-lg
                  `}
                >
                  <polyline 
                    points="15 18 9 12 15 6" 
                    className="animate-pulse"
                  />
                </svg>
              </div>
              
              {/* Ripple effect on click */}
              <div className={`
                absolute inset-0 
                bg-white/30 
                rounded-2xl 
                scale-0 
                group-active:scale-100 
                group-active:opacity-0 
                transition-all duration-300
                opacity-100
              `} />
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-1 h-1 
                    bg-violet-400 
                    rounded-full 
                    opacity-0 
                    group-hover:opacity-100
                    group-hover:animate-ping
                  `}
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${-10 + i * 10}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </button>
        </div>
  )
}

export default SidebarBtn