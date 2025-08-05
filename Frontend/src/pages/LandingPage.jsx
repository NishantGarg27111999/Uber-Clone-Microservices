
import { Link } from 'react-router-dom'
import uberLogo from '../assets/uberLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
function LandingPage(){
    return <div className="flex flex-col justify-between h-screen  bg-[url('/uber-landing.jpg')] bg-cover bg-center ">
        <img src={uberLogo} alt=""  className='w-18 relative top-5 left-5'/>
        <div className='bg-white rounded-lg p-4 relative sm:w-[30%] sm:absolute sm:right-0 sm:bottom-0 sm:h-screen flex flex-col justify-center '>
            <h2 className='text-3xl font-medium'>Get started with Uber</h2>
            <Link to="/home" className='bg-black mt-7 mb-3 text-white text-xl font-medium flex  justify-center  py-3  rounded-lg'>Continue <div className='align-middle absolute right-4 px-3'><FontAwesomeIcon   icon={faArrowRight}  beatFade size="xl" color='white'/></div></Link>
            
        </div> 
    </div>
}

export default LandingPage