import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faUser,faSpinner } from '@fortawesome/free-solid-svg-icons';
import car from '../assets/car.jpg';
import bike from '../assets/bike.jpg';
import auto from '../assets/auto.jpg';
import { useContext } from "react";
import { rideDataContext } from "../contexts/RideContext";


function VehiclePanel({vehicleRef, PanelOpenClose ,confirmRideRef, setVehicleImage}) {

    const {ride,setRide}=useContext(rideDataContext);
    return (
        <div ref={vehicleRef} className='absolute bottom-0 w-screen py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>
            <FontAwesomeIcon icon={faAngleDown} className='text-2xl w-full py-2' onClick={(e) => {
                PanelOpenClose(vehicleRef)
            }} />
            <h1 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h1>

            <div className='p-2 mb-2 border-2 border-gray-200 active:border-black  bg-gray-100  rounded-xl' onClick={(e) => {
                PanelOpenClose(vehicleRef);
                PanelOpenClose(confirmRideRef);
                
                setRide((prev)=>({...prev,vehicleType:"car"}));
                
            }}>
                <div className='flex justify-between items-center gap-2'>
                    <img src={car} alt="car_image" className='w-20 h-12' />
                    <div className='flex flex-col justify-center items-start flex-1/2'>
                        <div className='font-medium'>UberGo <FontAwesomeIcon icon={faUser} />4</div>
                        <div className='font-medium text-sm'>2 mins away</div>
                        <p className='text-xs text-gray-400'>Affordable, compact rides</p>
                    </div>
                    <div className='text-lg font-semibold'>₹ {ride.fare.car==""? <FontAwesomeIcon icon={faSpinner} spinPulse/>:  ride.fare.car}</div>
                </div>
            </div>
            <div className='p-2 mb-2 border-2 border-gray-200 active:border-black  bg-gray-100  rounded-xl' onClick={(e) => {
                PanelOpenClose(vehicleRef);
                PanelOpenClose(confirmRideRef);
                
                setRide((prev)=>({...prev,vehicleType:"bike"}));
                
            }}>
                <div className='flex justify-between items-center gap-2'>
                    <img src={bike} alt="bike_image" className='w-20' />
                    <div className='flex flex-col justify-center items-start flex-1/2'>
                        <div className='font-medium'>Moto <FontAwesomeIcon icon={faUser} />1</div>
                        <div className='font-medium text-sm'>2 mins away</div>
                        <p className='text-xs text-gray-400'>Affordable motorcycle rides</p>
                    </div>
                    <div className='text-lg font-semibold'>₹ {ride.fare.bike==""? <FontAwesomeIcon icon={faSpinner} spinPulse/>:  ride.fare.bike}</div>
                </div>
            </div>
            <div className='p-2 border-2 border-gray-200 active:border-black  bg-gray-100  rounded-xl' onClick={(e) => {
                PanelOpenClose(vehicleRef);
                PanelOpenClose(confirmRideRef);
                
                setRide((prev)=>({...prev,vehicleType:"auto"}));
                
            }}>
                <div className='flex justify-between items-center gap-2'>
                    <img src={auto} alt="car_image" className='w-20 h-12' />
                    <div className='flex flex-col justify-center items-start flex-1/2'>
                        <div className='font-medium'>UberAuto <FontAwesomeIcon icon={faUser} />3</div>
                        <div className='font-medium text-sm'>2 mins away</div>
                        <p className='text-xs text-gray-400'>Affordable Auto rides</p>
                    </div>
                    <div className='text-lg font-semibold'>₹ {ride.fare.auto==""? <FontAwesomeIcon icon={faSpinner} spinPulse/>:  ride.fare.auto}</div>
                </div>
            </div>
        </div>
    )
}

export default VehiclePanel;