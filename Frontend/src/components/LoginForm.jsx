import { useContext, useState } from "react";
import { userDataContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { captainDataContext } from "../contexts/CaptainContext";

function LoginForm({postURL,isCaptain}) {
    const[credentials,setCredentials]=useState({
        email:"",
        password:""
    });

    const{user,setUser}=useContext(userDataContext);
    const{setCaptain}=useContext(captainDataContext);
    const navigate=useNavigate();

    const submitHandler=async (e)=>{
        e.preventDefault();
        console.log(postURL);
        const response=await axios.post(postURL,credentials);
        if(response.status==200){
            const data=response.data;
            // console.log(data);
            isCaptain?setCaptain(data.captain):setUser(data.user);
            
            // console.log(response.cookie('token'));
            setCredentials({email:"", password:""});
            localStorage.setItem('token',data.token);
            isCaptain?navigate('/captain-home'):navigate('/home');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center ">
        <form className="flex flex-col mt-9 mb-7 w-full sm:w-[40%] sm:mt-18  sm:p-7 sm:rounded-lg sm:bg-gray-300" onSubmit={submitHandler}>
            <label htmlFor="email" className="text-xl font-medium mb-2">What's your email</label>
            <input type="email" name="email" id="email" required className="bg-[#eeeeee] px-4 py-2 mb-5 rounded-lg" placeholder="email@example.com" value={credentials.email} onChange={(e)=>{
                setCredentials((prev)=>{return {...prev,email:e.target.value}});
            }}/>
            <label htmlFor="password" className="text-xl font-medium mb-2">Enter Password</label>
            <input type="password" name="email" required id="password" className="bg-[#eeeeee] px-4 py-2 mb-7 rounded-lg" placeholder="password" value={credentials.password} onChange={(e)=>{
                setCredentials((prev)=>{return {...prev,password:e.target.value}});
            }}/>
            <button className='bg-black text-white py-2 rounded-sm font-medium text-xl cursor-pointer sm:mt-8'>Login</button>
        </form>
        </div>
    )

}

export default LoginForm