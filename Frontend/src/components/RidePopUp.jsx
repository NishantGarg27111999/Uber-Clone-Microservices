import { faAngleDown, faLocationDot, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import user from '../assets/user.jpg'
import { socketDataContext } from "../contexts/SocketContext";
import { captainDataContext } from "../contexts/CaptainContext";
import { useContext } from "react";

function RidePopUp({PanelOpenClose,ridePopUpRef,confirmRidePopUpPanelRef,ride,setCurrentRide}){
    const {sendMessage}=useContext(socketDataContext);
    const {captain}=useContext(captainDataContext);
    console.log('ride: ', ride);

    return(
        <div ref={ridePopUpRef}  className='absolute bottom-0 w-screen py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>
                    <FontAwesomeIcon icon={faAngleDown} className='text-2xl w-full py-2' onClick={(e) => {
                                    PanelOpenClose(ridePopUpRef)
                                }} />
                    <h2 className="text-xl font-medium mb-6">New Ride Available!</h2>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center justify-between w-full py-3 bg-yellow-400 rounded-lg p-2">
                            <div className="flex gap-3 items-center justify-between">
                            <img src={user} className="h-10 w-10 rounded-full object-cover " />
                            <div className="text-lg font-semibold capitalize">{ride.user?.fullname.firstname+" "+ride.user?.fullname.lastname}</div>
                            </div>
                            <div className="font-semibold">2.2KM</div>
                       

                        </div>
                        <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"><FontAwesomeIcon icon={faLocationDot} className='  text-green-700 text-xl capitalize'/><div>{ride.pickup}</div> </div>
                        <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl capitalize'/><div>{ride.destination}</div></div>
                        <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' '/><div>₹ {ride.fare}</div></div>
                        <div className="flex  w-full justify-between items-center">
                        <button className="w-1/3 rounded-lg bg-gray-300 text-gray-700 p-2 mt-4 font-medium text-lg mb-5" onClick={()=>{
                            PanelOpenClose(ridePopUpRef);
                            setCurrentRide(null);
                        }}>Ignore</button>
                        <button className="w-1/3 rounded-lg bg-green-600 text-white p-2 mt-4 font-medium text-lg mb-5" onClick={()=>{
                            PanelOpenClose(confirmRidePopUpPanelRef);
                            console.log('mein yha hun');
                            
                            sendMessage('ride-accepted',{rideId:ride._id, captainId:captain._id});
                            // setRide((prev)=>{
                            //     console.log('ride accepted: ',{...ride,captain:captain._id});
                            //     return {...ride,captain:captain._id};
                            // })
                        }}>Accept</button>
                        
                        </div>
                    </div>
                </div>
    )
}

export default RidePopUp;