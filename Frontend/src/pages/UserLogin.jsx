import { Link } from 'react-router-dom'
import uberLogo from '../assets/Uber_logo_black.png'
import LoginForm from '../components/LoginForm'
import { userDataContext } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
function UserLogin() {

    

    return (
        <div className='h-screen flex flex-col p-7 justify-between sm:bg-gradient-to-tr from-blue-300 to-red-500 overflow-hidden'>

            <div >
                <img src={uberLogo} alt="" className='w-18' />
                <LoginForm postURL={`${import.meta.env.VITE_BASE_URL}/user/login`} isCaptain={false}/>

                <p className='text-center font-medium'>New here? <Link to='/userSignup' className='text-blue-600'>Create new account</Link></p>
            </div>

            <Link to='/captain-login' className='bg-green-600 text-center text-white text-xl font-medium py-2 rounded-sm sm:w-[40%] sm:m-auto'>Sign in as Captain</Link>


           

        </div>
        

    )
}

export default UserLogin