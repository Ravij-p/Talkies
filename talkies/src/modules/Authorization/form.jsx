import React from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
import dft from "../../images/default.jpeg";
import img from "../../images/Screenshot 2024-04-12 214503.png";
import imge from "../../images/Screenshot 2024-04-12 214446.png";

const Form = ({
  isSignInPage=false
}) => {
  const navigate=useNavigate();
  const [data, setdata] = useState({
    ...(!isSignInPage && {userName:'' , profilePic:dft}),email:'',password:''
  })
  console.log(data);
  const handleSubmit=async (e)=>{
    e.preventDefault();
    const res=await fetch(`http://localhost:8000/api/${isSignInPage ? 'login': 'register'}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization: `Bearer ${localStorage.getItem('user:token')}`
      },
      body:JSON.stringify({...data})
    })
    console.log(res,'res');
    if(res.status==200 && isSignInPage){
      const {token,user} =await res.json();
      console.log(token,user,'response');
      localStorage.setItem('user:token',token);
      navigate('/');
    }
    else if(res.status==401 && isSignInPage){
      alert("Invalid Credentials");
    }
    else if(isSignInPage){
      alert("Error,Please try later");
    }
    else if(res.status==200){
      navigate("/account/signin");
    }
    else if(res.status==400){
      alert("Username already exists");
    }
    else{
      alert("Error,Please try later");
    }
  }
  return (
    <div className='bg-[#d2cfdf] h-screen w-full flex justify-center items-center'>
        <div className='h-[700px] w-[1000px] bg-white flex justify-center items-center'>
            <div className={`h-full w-full flex flex-col justify-center items-center bg-[#dde3f6] ${!isSignInPage && 'order-2'}`}>
                <div className='text-4xl font-serif text-4xl font-bold'>WELCOME {isSignInPage && 'BACK'}</div>
                <div className='mb-[50px] font-sans text-xl'>Please {isSignInPage ?'Login':'Sign Up'} to continue</div>
                <form className='w-[350px]' onSubmit={(e)=>{handleSubmit(e)}}>
                  {
                    !isSignInPage && 
                    <Input label='Username' type='text' placeholder='Enter Your UserName' value={data.userName} onChange={(e)=>setdata({...data,userName:e.target.value})} className='rounded-2xl font-sans'/>
                  }
                    <Input label='Email' type='text' placeholder='Enter Your Email' value={data.email} onChange={(e)=>setdata({...data,email:e.target.value})} className='rounded-2xl font-sans'/>
                    <Input label='Password' type='password' placeholder='Enter Your password' value={data.password} onChange={(e)=>setdata({...data,password:e.target.value})} className='rounded-2xl font-sans'/>
                    <Button label={isSignInPage ? 'Sign in' : 'Register'} className='my-5 bg-[#8d91f4] hover:bg-[#525197] w-full rounded-2xl font-sans text-xl'/>
                </form>
                <div className='cursor-pointer text-md hover:text-blue-700 underline font-Merriweather' onClick={()=>navigate(`${isSignInPage? '/account/signup' : '/account/signin'}`)}>{isSignInPage ? 'Create New Account':'Sign in'}</div>
            </div>
            <div className='h-full w-full bg-[#F2F5F8] flex justify-center items-center'>
                   {
                    isSignInPage ? <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Sign In Image"/> :
                     <img src={imge} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Register Image"/>
                    }
            </div>
        </div>
    </div>
  )
}
export default Form