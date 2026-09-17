import React from 'react'

const TitleHeader = ({title, subtitle}) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
    <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold font-playfair">
        {title}
      </h2>
          {subtitle && <p className="text-[clamp(0.875rem,2vw,1rem)] font-manrope">
            {subtitle}
          </p>}</div>
  )
}

export default TitleHeader
