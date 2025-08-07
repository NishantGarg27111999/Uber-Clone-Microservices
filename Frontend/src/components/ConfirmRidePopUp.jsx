import { faAngleDown, faLocationDot, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import user from '../assets/user.jpg';
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { rideDataContext } from "../contexts/RideContext";
import axios from "axios";
import { socketDataContext } from "../contexts/SocketContext";

function ConfirmRidePopUp({ confirmRidePopUpPanelRef, ridePopUpRef, PanelOpenClose, ride,setCurrentRide }) {
    console.log('confirmRidepopup ', ride);
    // const {ride}=useContext(rideDataContext);
    const {socket,sendMessage}=useContext(socketDataContext);
    const [OTP, setOTP] = useState(null);
    const navigate = useNavigate();
    async function submitHandler(e) {
        console.log("hello");
        e.preventDefault();
        console.log(OTP);
        console.log('ye wali ride pass ki: ', ride);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/confirm-ride`, {
            params: {
                rideId: ride._id,
                
                otp:OTP
            }, headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(response);
        if (response.status == 200) {
            
            navigate('/captain-riding',{state:{ride:ride}});
        }
    }

    return (
        <div ref={confirmRidePopUpPanelRef} className='h-screen absolute bottom-0 w-screen py-5   px-4   transition-all duration-1500 ease-in-out overflow-hidden bg-white rounded-xl translate-y-full'>

            <h2 className="text-xl font-medium mb-6 mt-4">Confirm to Start Ride!</h2>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-between w-full py-3 bg-yellow-400 rounded-lg p-2">
                    <div className="flex gap-3 items-center justify-between">
                        <img src={user} className="h-10 w-10 rounded-full object-cover " />
                        <div className="text-lg font-semiboldc capitalize">{ride.user?.fullname.firstname + " " + ride.user?.fullname.lastname}</div>
                    </div>
                    <div className="font-semibold">2.2KM</div>


                </div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"><FontAwesomeIcon icon={faLocationDot} className='  text-green-700 text-xl capitalize' /><div>{ride.pickup}</div> </div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4 border-b-2 border-b-gray-300"> <FontAwesomeIcon icon={faLocationDot} className=' text-red-700 text-xl capitalize' /><div>{ride.destination}</div></div>
                <div className="w-full text-lg font-medium p-2 flex items-center gap-4"> <FontAwesomeIcon icon={faWallet} className=' ' /><div>₹ {ride.fare}</div></div>


                <form  className="w-full mt-6">

                    <input value={OTP} onChange={(e) => {
                        setOTP(e.target.value);
                    }} type="number" name="otp" id="otp" placeholder="Enter OTP" className='font-mono py-2 px-4  text-lg outline-gray-600 bg-[#eee] w-full rounded-md mb-3' />
                    <div className="flex  w-full justify-between items-center mt-2">
                        <button className="w-1/3 rounded-lg bg-red-600 text-white p-2 mt-4 font-medium text-lg mb-5" onClick={(e) => {
                            e.preventDefault();
                            PanelOpenClose(ridePopUpRef);
                            PanelOpenClose(confirmRidePopUpPanelRef);
                            console.log("print userId: ",ride);
                            sendMessage('cancel-ride',ride.user.socketId);
                            setCurrentRide(null);
                        }}>Cancel</button>
                        <button  className="w-1/3 rounded-lg flex justify-center items-center bg-green-600 text-white p-2 mt-4 font-medium text-lg mb-5" onClick={submitHandler}>Confirm</button>
                    </div>
                </form>



            </div>
        </div>
    )
}

export default ConfirmRidePopUp;