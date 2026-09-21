import React from 'react'

const Logo = "/logo-big.svg";
import AdminLoginForm from './AdminLoginForm'
import { useAuthStore } from "../store/AuthStore"
import { Navigate } from 'react-router-dom'

const LoginForm = () => {
      const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  
  return (
    <div className='h-screen bg-[#F8FCF8] relative font-actor'>
        
        <div className='grid grid-cols-1 md:grid-cols-2 h-screen relative  z-10 '>
            <div className='hidden md:flex flex-col gap-5 justify-center  items-center text-black'>
                <img src={Logo} alt="logo" className="h-40 md:h-48 w-auto object-contain" />
                <h1 className='font-medium text-5xl'>Welcome to Beach Circle Mini Mart</h1>
                <p>Let's login to your account and unlock the experience</p>
            </div>
            <div className='h-screen bg-amber-400'>
                <AdminLoginForm/>
            </div>
        </div>
    </div>
  )
}

export default LoginForm
