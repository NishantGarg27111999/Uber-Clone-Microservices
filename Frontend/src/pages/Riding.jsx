import map from '../assets/map.gif';
import car from '../assets/car.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLocationDot, faWallet } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

function Riding() {
    const location=useLocation();
    const rideData=location.state?.ride;
    return (
        <div className='h-screen overflow-hidden '>
            <Link to='/home' className='fixed right-2 top-2  bg-white h-10 w-10 rounded-full flex items-center justify-center '>
            <FontAwesomeIcon icon={faHome} className=' ' />
            </Link>
            <div className='h-1/2'>
                <img src={map} alt="map" className='h-full w-full object-cover' />
            </div>
            <div className='p-4 h-1/2'>
                <div className="flex items-center justify-between mb-6">
                    <img src={car} className=" h-14  rounded-full " />
                    <div className="text-right">
                        <div className="text-lg font-medium capitalize">{rideData.captain?.fullname.firstname+" "+rideData.captain?.fullname.lastname}</div>
                        <div className="text-xl font-semibold -mb-1 -mt-1">{rideData.captain?.vehicle?.plate}</div>
                        <div className="text-sm text-gray-400">Maruti Suzuki Alto</div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">

                    <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300 capitalize"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl ' />{rideData.destination}</div>
                    <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' ' /><div>₹ {rideData.fare}</div></div>

                    <button className="w-full rounded-lg bg-green-600 text-white p-2 mt-5 font-medium text-lg">Make a Payment</button>
                </div>
            </div>
        </div>
    )
}

export default Riding;