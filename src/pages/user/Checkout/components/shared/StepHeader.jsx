import React from 'react'

const StepHeader = ({name}) => {
  return (
    <div className="flex items-center gap-3 justify-end mb-4 relative">
                
                <h1 className="text-base text-[#8E8E93] font-light">{name}</h1>
                <button className=" text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
  )
}

export default StepHeader