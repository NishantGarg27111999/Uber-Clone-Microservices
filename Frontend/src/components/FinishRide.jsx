import { Link, useLocation, useNavigate } from 'react-router-dom';
import user from '../assets/user.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faWallet } from '@fortawesome/free-solid-svg-icons';
import { socketDataContext } from '../contexts/SocketContext';
import { useContext } from 'react';

function FinishRide({ finishRidePanelRef,ride }) {

    // const location=useLocation();
    // const ride=location?.state.ride;
    const navigate=useNavigate();
    const {sendMessage}=useContext(socketDataContext);
    console.log(ride);
    function submitHandler(e){
        e.preventDefault();
        sendMessage('finish-ride',ride);
        navigate('/captain-home');
        

    }

    return (
        <div ref={finishRidePanelRef} className=' absolute bottom-0 w-screen py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>

            <h2 className="text-xl font-medium mb-6 mt-4">Finish this Ride!</h2>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-between w-full py-3 bg-yellow-400 rounded-lg p-2">
                    <div className="flex gap-3 items-center justify-between">
                        <img src={user} className="h-10 w-10 rounded-full object-cover " />
                        <div className="text-lg font-semibold capitalize">{ride.user.fullname.firstname+" "+ride.user.fullname.lastname}</div>
                    </div>
                    <div className="font-semibold">2.2KM</div>


                </div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300 capitalize"><FontAwesomeIcon icon={faLocationDot} className='  text-green-700 text-xl' /><div>{ride.pickup}</div> </div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300 capitalize"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl' /><div>{ride.destination}</div></div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' ' /><div>₹ {ride.fare}</div></div>




                
                    
                    <button  className="w-full rounded-lg flex justify-center items-center bg-green-600 text-white p-2 mt-4 font-medium text-lg mb-5" onClick={submitHandler}>Finish Ride</button>
                




            </div>
        </div>
    )
}

export default FinishRide;