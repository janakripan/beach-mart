import React from 'react'
import AuthBg from '../../../assets/AuthBg.jpg'
import SignInForm from './SignInForm'
const Logo = "/Logo.png";
import { useAuthStore } from '../store/AuthStore'
import { Navigate } from 'react-router-dom'

const SignIn = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='h-screen bg-center bg-no-repeat relative font-actor' style={{ backgroundImage:`url(${AuthBg})`}}>
        <div className='absolute inset-0 bg-black/12'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 h-screen relative  z-10 '>
            <div className='hidden md:flex flex-col gap-5 justify-center  items-center text-white'>
                <img src={Logo} alt="logo" className=' h-20 object-cover ' />
                <h1 className='font-medium text-5xl'>Welcome to Dilka</h1>
                <p>Let's create your account and unlock the experience</p>
            </div>
            <div className='h-screen bg-amber-400'>
                <SignInForm/>
            </div>
        </div>
    </div>
  )
}

export default SignIn
