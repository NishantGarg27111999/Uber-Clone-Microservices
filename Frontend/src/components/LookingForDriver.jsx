import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faAngleDown, faWallet } from '@fortawesome/free-solid-svg-icons'
import WaitingForDriver from "./WaitingForDriver";
import { rideDataContext } from "../contexts/RideContext";
import { useContext, useEffect } from "react";
import { socketDataContext } from "../contexts/SocketContext";

function LookingForDriver({ lookingForDriverRef, vehicleImage,PanelOpenClose,waitingForDriverRef,setRideInfo }) {
    
    const {socket}=useContext(socketDataContext);
    const {ride}=useContext(rideDataContext);

    

    

    return (
        <div ref={lookingForDriverRef} className='absolute bottom-0 w-screen  py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>
            <style>
                {
                    `
                    @keyframes fill1{
                    0% {width: 100%;}
                    100% {width:0%}
                    
                    }
                    @keyframes fill2{
                    0% {width: 0%;}
                    100% {width:100%}
                    
                    }
                    `
                }
            </style>

            <FontAwesomeIcon icon={faAngleDown} className='text-2xl w-full py-2' onClick={(e) => {
                PanelOpenClose(lookingForDriverRef) 
            }} />
            <h2 className="text-xl font-medium mb-4">Looking For Driver</h2>
            <div className="w-full flex mb-6">

            <div className="h-0.5  bg-blue-500  w-[50%] rounded-lg">
                <div className="w-full h-full  bg-gray-300  animate-[fill1_0.5s_linear_infinite]"></div>
            </div>
            <div className="h-0.5 bg-gray-300  w-[50%] rounded-lg">
            <div className="w-full h-full  bg-blue-500 animate-[fill2_0.5s_linear_infinite]"></div>
            </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <img src={`/${ride.vehicleType}.jpg`} className="h-20  mb-4" />
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"><FontAwesomeIcon icon={faLocationDot} className='  text-green-700 text-xl' /><div>{ride.pickUp}</div> </div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl' /><div>{ride.destination}</div></div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' ' /><div>₹ {ride.fare[ride.vehicleType]}</div></div>
                
            </div>
        </div>
    )
}

export default LookingForDriver;
