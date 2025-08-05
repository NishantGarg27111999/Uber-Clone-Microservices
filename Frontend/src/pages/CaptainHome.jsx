import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import uberDriver from '../assets/uberDriver.png';
import { faClock, faGaugeSimpleHigh, faHome, faLocationDot, faWallet } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import map from '../assets/map.gif';
import user from '../assets/user.jpg'
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useContext, useEffect, useRef, useState } from 'react';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { captainDataContext } from '../contexts/CaptainContext';
import { socketDataContext } from '../contexts/SocketContext';
import { rideDataContext } from '../contexts/RideContext';



function CaptainHome() {
    console.log('captain-rerender');
    const { captain, setCaptain } = useContext(captainDataContext);
    const { socket, sendMessage, receiveMessage } = useContext(socketDataContext);
    
    const [ride,setRide]=useState({});
    console.log('captainHome: ',ride);
    const MAX_QUEUE_SIZE=10;

    
    const [currentRide,setCurrentRide]=useState(null);
    console.log('socket print: ');
    console.log(socket);

    useEffect(() => {
        console.log('refresh pe chala');
        console.log(captain);
        console.log("sending join message for captian");
        sendMessage('join', { userType: 'captain', user: captain })
        // sendMessage('ride-accepted',{});


        const updateLocation = () => {
            console.log(captain);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    console.log({
                        captainId: captain._id,
                        ltd: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    sendMessage('update-captain-location', {
                        captainId: captain._id,
                        ltd: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000);



        return () => clearInterval(locationInterval);
    },[socket,captain])

    function PanelOpenClose(panelRef) {
        panelRef.current.classList.toggle("translate-y-full");
    }


    const [queue,setQueue]=useState([]);
    useEffect(() => {
        console.log('socket changed');
        
        socket.on('new-ride', (ride) => {
           console.log('new ride came');
            if(queue.length<MAX_QUEUE_SIZE){
                console.log('new ride pushed to queue');
                setQueue((prevQueue)=>{
                    if(prevQueue.length<MAX_QUEUE_SIZE){
                        
                        return [...prevQueue,ride]
                    }
                    else{
                        return prevQueue;
                    }
                })
                
                
            }
            
            

        })
        return () => {
            socket.off('new-ride')
        }

    }, [socket]);

    useEffect(()=>{
        console.log(queue.length);
        

        // console.log("second useEffect is running");
        if(queue.length && currentRide==null){
            console.log("useeffect for queueUpdated");
            console.log(queue);
            const nextRide=queue.shift();
            setCurrentRide(nextRide);
            setTimeout(()=>{
                PanelOpenClose(ridePopUpRef);
                setRide(nextRide);
            },2000)
            
            
        }
    },[queue,currentRide])

    useEffect(()=>{
        socket.on('ride-gone',({rideId, captainId, message})=>{
            console.log('ride-gone chala');
            console.log(message);
            console.log(captain);
            console.log(rideId);
            console.log(currentRide);
            if(currentRide._id==rideId && captainId!=captain._id){
                console.log('hahahahaha...');
                setCurrentRide(null);
                PanelOpenClose(ridePopUpRef);
            }
            else{
                const result=queue.filter((rd)=>{
                    return rd._id!=rideId;
                })
                setQueue(result);
            }
        })

        return () => {
            socket.off('ride-gone');
        }
    },[socket,currentRide])

    const ridePopUpRef = useRef(null);
    const confirmRidePopUpPanelRef = useRef(null);



    return (
        <div className='h-screen relative overflow-y-hidden'>
            <div className='fixed top-0 p-2 flex items-center justify-between w-screen'>
                <img src={uberDriver} alt="driverLogo" className='w-16' />
                <Link to='/home' className='  bg-white h-10 w-10 rounded-full flex items-center justify-center '>
                    <FontAwesomeIcon icon={faHome} className=' ' />
                </Link>
            </div>

            <div className='h-2/3'>
                <img src={map} alt="map" className='h-full w-full object-cover' />
            </div>
            <CaptainDetails />
            <RidePopUp ridePopUpRef={ridePopUpRef} confirmRidePopUpPanelRef={confirmRidePopUpPanelRef} PanelOpenClose={PanelOpenClose} ride={ride} setCurrentRide={setCurrentRide}/>
            <ConfirmRidePopUp confirmRidePopUpPanelRef={confirmRidePopUpPanelRef} ridePopUpRef={ridePopUpRef} PanelOpenClose={PanelOpenClose} ride={ride} setCurrentRide={setCurrentRide}/>


        </div>
    )
}

export default CaptainHome;