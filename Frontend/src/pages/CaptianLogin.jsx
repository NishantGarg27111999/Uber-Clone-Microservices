import { Link } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import uberDriver from "../assets/uberDriver.png"
import { faTruckFieldUn } from "@fortawesome/free-solid-svg-icons"

function CaptainLogin(){
    return (
        <div className='h-screen flex flex-col p-7 justify-between sm:bg-gradient-to-tr from-blue-300 to-red-500'>
        <div>
            <img src={uberDriver} alt="" className="w-12"/>
            <LoginForm postURL={`${import.meta.env.VITE_BASE_URL}/captains/login`} isCaptain={true}/>
            <p className='text-center font-medium'>Join a fleet? <Link to='/captain-Signup' className='text-blue-600'>Register as Captain</Link></p>


        </div>
        <Link to='/userLogin' className='bg-amber-700 text-center text-white text-xl font-medium py-2 rounded-sm sm:w-[40%] sm:m-auto'>Sign in as User</Link>

        </div>


    )
}

export default CaptainLogin