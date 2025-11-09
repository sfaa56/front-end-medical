import React from 'react'

function Loading() {
  return (
                      <div className="w-full flex justify-center items-center min-h-[200px]">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-secondary rounded-full" />
          <span className="ml-2 text-secondary">Loading...</span>
        </div>
  )
}

export default Loading