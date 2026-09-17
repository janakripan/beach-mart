import React from 'react'

const Tag = ({color, title}) => {
  return (
    <div className={`flex justify-center items-center text-white rounded-full`} 
    style={{ backgroundColor: color }}>
          <span className="text-xs px-3 py-1 uppercase ">{title}</span>
        </div>
  )
}

export default Tag
