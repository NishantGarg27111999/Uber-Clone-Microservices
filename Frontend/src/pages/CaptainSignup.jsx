import { Link, useNavigate } from 'react-router-dom'
import uberDriver from '../assets/uberDriver.png'
import { useContext, useState } from 'react';
import axios from 'axios';
import { captainDataContext } from '../contexts/CaptainContext';

function CaptainSignup() {
    const {captain,setCaptain}=useContext(captainDataContext);
    const navigate=useNavigate();
    const [captainData,setCaptainData]=useState({
        fullname:{
            firstname:"",
            lastname:""
        },
        email:"",
        password:"",
        vehicle:{
            color:"",
            plate:"",
            capacity:"",
            vehicleType:""
        }
    });
    const submitHandler=async(e)=>{
        e.preventDefault();
        console.log(captainData);

        const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`,captainData);
        if(response.status==201){
            const data=response.data;
            console.log(data);
            setCaptain(data.captain);
            localStorage.setItem('token',data.token);
            navigate('/captain-home');

            
        }

        setCaptainData({
            fullname:{
                firstname:"",
                lastname:""
            },
            email:"",
            password:"",
            vehicle:{
                color:"",
                plate:"",
                capacity:"",
                vehicleType:""
            }
        });
    }
    return (
        <div className='p-7 overflow-hidden w-screen h-screen   sm:flex sm:justify-center sm:items-center sm:bg-gradient-to-tr from-blue-300 to-red-500'>
            <div className='sm:w-[60%] sm:bg-gray-300 sm:p-4 sm:rounded-lg sm:shadow-[0_4px_6px_4px_rgba(0,0,0,0.1)]'>
                <img src={uberDriver} alt="" className='w-12' />
                <form className='flex flex-col mt-7 mb-7 sm:my-6' onSubmit={submitHandler}>
                    <label htmlFor="name" className='font-medium text-xl mb-2 sm:mb-1 sm:text-lg'>What's our Captian's name</label>
                    <div className='flex gap-4'>
                        <input type="text" name="firstname" id="name" placeholder='firstname' className="bg-[#eeeeee] px-4 py-2 mb-5 w-1/2 sm:mb-2 sm:py-1 rounded-lg" value={captainData.fullname.firstname} onChange={(e)=>{
                            setCaptainData((prev)=>{
                                return {...prev,fullname:{...prev.fullname,firstname:e.target.value}}
                            })
                        }}/>
                        <input type="text" name="lastname" placeholder='lastname' className="bg-[#eeeeee] px-4 py-2 mb-5 w-1/2 sm:mb-2 sm:py-1 rounded-lg" value={captainData.fullname.lastname} onChange={(e)=>{
                            setCaptainData((prev)=>{
                                return {...prev,fullname:{...prev.fullname,lastname:e.target.value}};
                            })
                        }} />
                    </div>
                    <label htmlFor="email" className='font-medium text-xl mb-2 sm:mb-1 sm:text-lg'>What's our Captain's email</label>
                    <input type="text" name="email" id="email" placeholder='email@example.com' className="bg-[#eeeeee] px-4 py-2 mb-5 sm:mb-2 sm:py-1 rounded-lg" value={captainData.email} onChange={(e)=>{
                        setCaptainData((prev)=>{
                            return {...prev,email:e.target.value};
                        })
                    }} />
                    <label htmlFor="password" className='font-medium text-xl mb-2 sm:mb-1 sm:text-lg'>Enter Password</label>
                    <input type="password" name="password" id="password" placeholder='password' className="bg-[#eeeeee] px-4 py-2 mb-5 sm:mb-2 sm:py-1 rounded-lg" value={captainData.password} onChange={(e)=>{
                        setCaptainData((prev)=>{
                            return {...prev,password:e.target.value};
                        })
                    }} />
                    <label htmlFor="vehicle" className='font-medium text-xl mb-2 sm:mb-1 sm:text-lg'>Vehicle Information</label>
                    <div id="vehicle" className='flex flex-wrap overflow-hidden gap-x-4 justify-center p-1 '>
                        <input type="text" name="color" id="color" placeholder='color' className="bg-[#eeeeee] px-4 py-2 mb-5  w-[45%] sm:mb-2 sm:py-1 rounded-lg" value={captainData.vehicle.color} onChange={(e)=>{
                            setCaptainData((prev)=>{
                                return {...prev, vehicle:{...prev.vehicle,color:e.target.value}}
                            })
                        }} />
                        <input type="text" name="plate" id="plate" placeholder='plate no.' className="bg-[#eeeeee] px-4 py-2 mb-5 w-[45%] sm:mb-2 sm:py-1 rounded-lg" value={captainData.vehicle.plate} onChange={(e)=>{
                            setCaptainData((prev)=>{
                                return {...prev,vehicle:{...prev.vehicle,plate:e.target.value}};
                            })
                        }} />
                        <input type="number" name='capacity' id='capacity' placeholder='capacity' className="bg-[#eeeeee] px-4 py-2 mb-5 w-[45%] sm:mb-2 sm:py-1 rounded-lg" value={captainData.vehicle.capacity} onChange={(e)=>{
                            setCaptainData((prev)=>{
                                return {...prev,vehicle:{...prev.vehicle,capacity:e.target.value}};
                            })
                        }} />
                        <select name="vehicle-type" id="vehicle-type" className='bg-[#eeeeee] px-4 py-2 mb-5 w-[45%] sm:mb-1 sm:py-1 rounded-lg' value={captainData.vehicle.vehicleType} onChange={(e)=>{
                            setCaptainData((prev)=>{
                                return {...prev,vehicle:{...prev.vehicle,vehicleType:e.target.value}};
                            })
                        }} >
                            <option value="" disabled>select a vehicle</option>
                            <option value="car" className='overflow-hidden'>car</option>
                            <option value="moto">moto</option>
                            <option value="auto">auto</option>
                        </select>
                    </div>
                    <button className='bg-black text-white py-2 rounded-sm font-medium text-xl cursor-pointer sm:text-lg sm:mt-8'>Create account</button>
                </form>
                <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
            </div>
        </div>
    )
}

export default CaptainSignup