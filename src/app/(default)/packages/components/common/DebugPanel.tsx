"use client"

import { useState } from "react"

interface DebugPanelProps {
  data: any
}

export default function DebugPanel({ data }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-all"
      >
        🐛 Debug
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-[600px] max-h-[600px] overflow-auto bg-gray-900 text-green-400 p-4 rounded-lg shadow-2xl font-mono text-xs">
          <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-900 pb-2">
            <h3 className="text-white font-bold">Debug Data</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              ✕
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
