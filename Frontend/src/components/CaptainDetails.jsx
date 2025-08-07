import { faClock, faGaugeSimpleHigh, faRoad } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import user from '../assets/user.jpg'
import { captainDataContext } from "../contexts/CaptainContext"
import { useContext, useEffect, useState } from "react"
import axios from "axios"

function CaptainDetails(){
    const {captain}=useContext(captainDataContext);
    const [moneyEarnedToday, setMoneyEarnedToday]=useState(0);
    const [distanceToday, setDistanceToday]=useState(0);
    const [ridesToday, setRidesToday]=useState(0);


    console.log('in captaindetails: ',captain);

    useEffect(()=>{
        async function fetchMoney(){
        if(Object.keys(captain).length === 0){
            console.log('captain is not loaded still...');
            return ;
        }
        try{
        console.log('inside useEffect: ',captain);
        const response=await axios.get(`http://localhost:4000/captains/${captain._id}`);
        // console.log(response);
        console.log('fetched money: ',response.data);
        const captainDetails=response.data;
        console.log('captaindetails: ',captainDetails);
        setMoneyEarnedToday(captainDetails.moneyEarned);
        setRidesToday(captainDetails.ridesToday);
        setDistanceToday(captainDetails.distanceCoveredToday);
        }
        catch(err){
            console.log(err.message);
            
        }
    }
    fetchMoney();
    },[captain])
    return (
        <div className='p-4 h-1/3'>
                <div className="flex items-center justify-between mb-6">
                    <div className='flex items-center gap-1'>
                        <img src={user} className=" h-14 w-14 object-cover rounded-full " />
                        <div className="text-lg font-medium capitalize">{captain?.fullname?.firstname +" "+ captain?.fullname?.lastname}</div>

                    </div>
                    <div className='text-right'>
                        <div className='text-xl font-semibold'>₹{moneyEarnedToday}</div>
                        <div className='text-sm font-light text-gray-500'>Earned</div>
                    </div>
                </div>

                <div className='flex justify-evenly bg-yellow-400 p-4 rounded-lg'>
                    {/* <div className='flex flex-col justify-center items-center'>
                        <FontAwesomeIcon icon={faClock} className='text-xl ' />
                        <div className=' font-medium'>10.2</div>
                        <div className='text-xs '>Hours Online</div>
                    </div> */}
                    <div className='flex flex-col justify-center items-center'>
                    <FontAwesomeIcon icon={faGaugeSimpleHigh} className='text-xl ' />
                        <div className='text-lg font-medium'>{distanceToday}</div>
                        <div  className='text-xs '>Kms Distance</div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                    <FontAwesomeIcon icon={faRoad} className='text-xl ' />
                        <div className='text-lg font-medium'>{ridesToday}</div>
                        <div  className='text-xs '>Rides</div>
                    </div>
                </div>

            </div>
    )
}

export default CaptainDetails;