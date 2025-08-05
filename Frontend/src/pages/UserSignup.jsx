import { Link, useNavigate } from 'react-router-dom';
import uberLogo from '../assets/Uber_logo_black.png'
import { useContext, useState } from 'react';
import axios from 'axios';
import { userDataContext } from '../contexts/UserContext';

function UserSignup() {

    const{user,setUser}=useContext(userDataContext);
    const navigate=useNavigate();
    const [userData,setUserData]=useState({
        fullname:{
            firstname:"",
            lastname:""
        },
        email:"",
        password:""
    });
    const submitHandler=async (e)=>{
        e.preventDefault();

        
        // console.log(userData);
        const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`,userData);
        const data=response.data;
        // console.log(response.data);
        
        if(response.status==201){
            setUser(data.createdUser);
            console.log(user);
            localStorage.setItem('token',data.token);
            navigate('/home');

        }
        setUserData({fullname:{
            firstname:"",
            lastname:""
        },
        email:"",
        password:""});
    }
    
    return <div className='p-7 sm:flex  h-screen sm:justify-center sm:items-center sm:bg-gradient-to-tr from-blue-300 to-red-500 '>
        <div className='sm:w-[40%] sm:bg-gray-300  sm:p-4 sm:rounded-lg sm:shadow-[0_4px_6px_4px_rgba(0,0,0,0.1)] '>
        <img src={uberLogo} alt="" className='w-18' />
        <form className='flex flex-col mt-9 mb-7 sm:my-11' onSubmit={submitHandler}>
            <label htmlFor="name" className='font-medium text-xl mb-2'>What's your name</label>
            <div className='flex gap-4'>
                <input type="text" name="firstname" id="name" placeholder='firstname' className="bg-[#eeeeee] px-4 py-2 mb-5 w-1/2 rounded-lg" value={userData.fullname.firstname} onChange={(e)=>{
                    console.log(e.target.value);
                    setUserData((prev)=>{
                        console.log(userData);
                        return {...prev,fullname:{firstname:e.target.value,lastname:prev.fullname.lastname}}
                    })
                }}/>
                <input type="text" name="lastname"  placeholder='lastname' className="bg-[#eeeeee] px-4 py-2 mb-5 w-1/2 rounded-lg" value={userData.fullname.lastname} onChange={(e)=>{
                    console.log(e.target.value);
                    setUserData((prev)=>{
                        console.log(userData);
                        return {...prev,fullname:{lastname:e.target.value,firstname:prev.fullname.firstname}};
                    })
                }}/>
            </div>
            <label htmlFor="email" className='font-medium text-xl mb-2'>What's your email</label>
            <input type="text" name="email" id="email" placeholder='email@example.com' className="bg-[#eeeeee] px-4 py-2 mb-5 rounded-lg" onChange={(e)=>{
                setUserData((prev)=>{
                    return {...prev,email:e.target.value};
                })
            }}/>
            <label htmlFor="password" className='font-medium text-xl mb-2'>Enter Password</label>
            <input type="password" name="password" id="password" placeholder='password' className="bg-[#eeeeee] px-4 py-2 mb-9 rounded-lg" onChange={(e)=>{
                setUserData((prev)=>{
                    return {...prev,password:e.target.value};
                })
            }}/>
            <button className='bg-black text-white py-2 rounded-sm font-medium text-xl cursor-pointer' >Create account</button>
        </form>
        <p className='text-center'>Already have a account? <Link to='/userLogin' className='text-blue-600'>Login here</Link></p>
    </div>
    </div>
}
export default UserSignup;