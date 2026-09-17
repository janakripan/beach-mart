import React from 'react'
import { useRemainingSteps } from '../../store/Selectors'

const RemainingSteps = () => {
    const remainingSteps = useRemainingSteps();
    const stepMap = {
      login:"Login",
      address:"Delivery Address",
      review:"Order Summary",
      payment:"Payment Options"
    }
  return (
    <div className='flex flex-col gap-2 items-center justify-center  '>
      {
        remainingSteps.map((st, i)=>(
          <div key={i} className='bg-gray-200 w-full flex justify-center p-2 rounded-xl'>
            {stepMap[st]}
          </div>
        ))
      }
    </div>
  )
}

export default RemainingSteps