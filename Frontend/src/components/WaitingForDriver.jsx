import { faAngleDown, faLocationDot, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import car from '../assets/car.jpg'

function WaitingForDriver({waitingForDriverRef,PanelOpenClose,rideInfo}){

    console.log(rideInfo);
    return(
        <div ref={waitingForDriverRef} className='absolute bottom-0 w-screen py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>
                    <FontAwesomeIcon icon={faAngleDown} className='text-2xl w-full py-1' onClick={(e) => {
                        PanelOpenClose(waitingForDriverRef)
                    }} />
                    <div className="flex items-center justify-between mb-6">
                        <img src={car} className=" h-14  rounded-full "/>
                        <div className="text-right">
                            <div className="text-lg font-medium capitalize">{rideInfo.captain?.fullname.firstname+" "+rideInfo.captain?.fullname.lastname}</div>
                            <div className="text-xl font-semibold -mb-1 -mt-1 ">{rideInfo?.captain?.vehicle.plate}</div>
                            <div className="text-sm text-gray-400">Maruti Suzuki Alto</div>
                            <div>OTP: {rideInfo.otp}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        
                        <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"><FontAwesomeIcon icon={faLocationDot} className='  text-green-700 text-xl capitalize' /><div>{rideInfo.pickup}</div> </div>
                        <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl capitalize' /><div>{rideInfo.destination}</div></div>
                        <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' ' /><div>₹ {rideInfo.fare}</div></div>
                        
                    </div>
                </div>
    )
}

export default WaitingForDriver