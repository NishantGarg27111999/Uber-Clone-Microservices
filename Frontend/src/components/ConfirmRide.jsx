import car from "../assets/car.jpg";
import bike from "../assets/bike.jpg";
import auto from "../assets/auto.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot,faAngleDown,faWallet } from '@fortawesome/free-solid-svg-icons';
import { rideDataContext } from "../contexts/RideContext";
import { useContext } from "react";
import axios from "axios";



function ConfirmRide({confirmRideRef,PanelOpenClose,vehicleImage,lookingForDriverRef}){
    const {ride}=useContext(rideDataContext);

    async function createRide(){
        console.log(ride);
        const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/create`,{
            pickup: ride.pickUp,
            destination: ride.destination,
            vehicleType: ride.vehicleType
        },{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        console.log(response);
    }
    
    return(
        <div ref={confirmRideRef} className='absolute bottom-0 w-screen py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>
            <FontAwesomeIcon icon={faAngleDown} className='text-2xl w-full py-2' onClick={(e) => {
                            PanelOpenClose(confirmRideRef)
                        }} />
            <h2 className="text-xl font-medium mb-6">Confirm your Ride</h2>
            <div className="flex flex-col items-center gap-2">
                <img src={`/src/assets/${ride.vehicleType}.jpg`} className="h-20  mb-4 " />
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"><FontAwesomeIcon icon={faLocationDot} className='  text-green-700 text-xl'/><div>{ride.pickUp}</div> </div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl'/><div>{ride.destination}</div></div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' '/><div>₹ {ride.fare[ride.vehicleType]}</div></div>
                <button className="w-full rounded-lg bg-green-600 text-white p-2 mt-4 font-medium text-lg mb-5" onClick={()=>{
                    PanelOpenClose(lookingForDriverRef);
                    PanelOpenClose(confirmRideRef);
                    createRide();
                }}>Confirm</button>
            </div>
        </div>
    )
}

export default ConfirmRide;