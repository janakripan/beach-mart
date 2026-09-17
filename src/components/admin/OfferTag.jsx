import React from 'react'

const OfferTag = ({title}) => {
  return (
    <div className={`flex justify-center font-actor items-center text-white border border-[#D6AD67]`} >
          <span className="text-xs px-3 py-1 uppercase text-[#D6AD67] ">{title}</span>
        </div>
  )
}

export default OfferTag
