import React from 'react'
import AddressForm from '../shared/AddressForm'
import AddressCard from '../shared/AddressCard'
import StepHeader from '../shared/StepHeader'

const AddressStep = () => {
  return (
    <div className='py-5'>
      <StepHeader name={"Delivery Address"}/>
      <AddressCard/>
      
    </div>
  )
}

export default AddressStep