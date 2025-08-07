import uberLogo from '../assets/Uber_logo_black.png'
import map from '../assets/map.gif';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faAngleDown, faUser } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useRef, useState } from 'react';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import axios from 'axios';
import { rideDataContext } from '../contexts/RideContext';
import { socketDataContext } from '../contexts/SocketContext';
import { userDataContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import InitialMap from './InitialMap';
import MapWithRoute from '../components/MapWithRoute';

import RedPopUp from '../components/RedPopUp';
import GreenPopUp from '../components/GreenPopUp';



function Home() {

    const [rideData, setRideData] = useState({ pickUp: '', destination: '' });
    const [activeField, setActiveField] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const locationRef = useRef(null);
    const vehicleRef = useRef(null);
    const container = useRef(null);
    const confirmRideRef = useRef(null);
    const lookingForDriverRef = useRef(null);
    const waitingForDriverRef = useRef(null);
    // const rideFindRef = useRef(null);
    const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
    const downArrow = useRef(null);
    const [toggle, setToggle] = useState(true);
    const { ride, setRide } = useContext(rideDataContext);
    const { socket, sendMessage, receiveMessage } = useContext(socketDataContext);
    const { user } = useContext(userDataContext);
    const [rideInfo, setRideInfo] = useState({});
    const [captainLocation, setCaptainLocation] = useState(null);
    const [content, setContent] = useState("");
    const [showRedPopUp, setShowRedPopUp] = useState(false);
    const [showGreenPopUp, setShowGreenPopUp] = useState(false);




    socket.on('captain-location-update', (data) => {
        // console.log("for update location ", data);
        // console.log('setcaptainLocation',data);
        setCaptainLocation({ lat: data.ltd, lng: data.lng });
    })



    useEffect(() => {
        socket.on('ride-cancelled', () => {
            console.log('ride cancelled run');
            setContent('Ride cancelled');
            setShowRedPopUp(true);
            setCaptainLocation(null);
            setTimeout(() => {
                setShowRedPopUp(false);
            }, 3000);
            PanelOpenClose(waitingForDriverRef);
        })
        return () => {
            socket.off('ride-cancelled');
        }

    }, [])

    useEffect(() => {
        socket.on('ride-accepted', (ride) => {
            console.log('ride-accepted');
            setContent('Ride accepted');
            setShowGreenPopUp(true);
            setTimeout(() => {
                setShowGreenPopUp(false);
            }, 3000);
            console.log(ride);
            setRideInfo(ride);
            PanelOpenClose(lookingForDriverRef);
            PanelOpenClose(waitingForDriverRef);

        })

        return () => {
            socket.off('ride-accepted');
        }
    }, [socket])

    const navigate = useNavigate();
    console.log(user);

    useEffect(() => {
        console.log(user);
        sendMessage('join', { userType: 'user', user })
    }, [user,socket])

    function PanelOpenClose(panelRef) {
        panelRef.current.classList.toggle("translate-y-full");
    }


    useEffect(()=>{
         socket.on('ride-started', (ride) => {
        console.log('ride started');

        navigate('/riding', { state: { ride: ride } })
    })

    },[socket]);



    useEffect(()=>{
        socket.on('ride-finished', () => {
        console.log('ride completed on userside');
        setContent('Ride finished');
        setCaptainLocation(null);

        navigate('/home');
    })
    },[socket])





    const submitHandler = async (e) => {

        setRide({pickUp:"",
        destination:"",
        fare:{
            car:"",
            auto:"",
            bike:""
        },
        vehicleType:""
    });
        
        e.preventDefault();
        console.log("hello");
        console.log(rideData);

        if (rideData.pickUp && rideData.destination) {

            PanelOpenClose(vehicleRef);
            locationRef.current.classList.toggle("grow-1");
            locationRef.current.classList.toggle("py-4");
            downArrow.current.classList.toggle("hidden");
            setTimeout(() => {
                container.current.classList.remove("h-screen")
            }, 1500)
            setToggle(true);
        }



        const fareRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-fare`, {
            params: { pickup: rideData.pickUp, destination: rideData.destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });
        const {fare}=fareRes.data;
        console.log(fare);

        setRide((prevState) => ({
            ...prevState,
            pickUp: rideData.pickUp,
            destination: rideData.destination,
            fare: fare
        }))




        setRideData({ pickUp: "", destination: "" });


    }
    console.log(ride);

    const handleChange = async (e) => {


        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-suggestions`, {
            params: { input: e.target.value },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });
        console.log(response);
        if (response.status == 200) {
            console.log(response.data);
            setSuggestions(response.data);
        }

    };

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 2000);

        return () => clearTimeout(timeout);

    }, [query])

    useEffect(() => {
        if (!debouncedQuery) return;

        const fetchSuggestion = async () => {
            try {
                console.log("suggestion chala");
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-suggestions`, {
                    params: { input: debouncedQuery },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                console.log(response);
                if (response.status == 200) {
                    console.log(response.data);
                    setSuggestions(response.data);
                }
            }
            catch(err){
                console.log(err);
            }
        }

        fetchSuggestion();
    }, [debouncedQuery])


    return (
        <div className='h-screen relative overflow-hidden '>
            {showRedPopUp && <RedPopUp color='red' content={content} />}
            {showGreenPopUp && <GreenPopUp content={content} />}
            <img src={uberLogo} alt="uberLogo" className='w-18 absolute top-5 left-5 z-0 pointer-events-auto' />
            <div className='h-full w-full -z-1 '>
                {ride.pickUp != "" ? <MapWithRoute ride={ride} captainLocation={captainLocation} /> : <InitialMap />}
                {/* <MapWithRoute/> */}
                {/* <img src={map} alt="map" className='h-full w-full' /> */}
            </div>
            <div ref={container} className=' absolute bottom-0 h-auto w-full gap-0  flex flex-col  justify-end sm:w-[40%] sm:right-0 overflow-hidden pointer-events-auto'>
                <div className='    '>
                    <form className='  relative bg-white px-6 py-4' onSubmit={submitHandler}>

                        <h1 className='font-semibold text-2xl mb-5 '>Find a Trip</h1>
                        <span ref={downArrow} className='hidden'>
                            <FontAwesomeIcon icon={faAngleDown} className='text-2xl absolute top-4 right-4' onClick={() => {

                                locationRef.current.classList.toggle("grow-1");
                                locationRef.current.classList.toggle("py-4");
                                downArrow.current.classList.toggle("hidden");
                                setTimeout(() => {
                                    container.current.classList.remove("h-screen")
                                }, 1500)
                                setToggle(true);
                            }} />
                        </span>

                        <input type="text" required name="pickup-location" id="pickup-location" placeholder='Enter pick-up location' className='py-2 px-7 pl-10 text-lg outline-gray-600 bg-[#eee] w-full rounded-md mb-3' value={rideData.pickUp} onChange={(e) => {

                            setRideData((prevState) => ({ ...prevState, pickUp: e.target.value }));
                            setQuery(e.target.value);
                            // handleChange(e);
                        }} onClick={(e) => {
                            if (toggle) {
                                container.current.classList.add("h-screen")
                                locationRef.current.classList.toggle("grow-1");
                                locationRef.current.classList.toggle("py-4");
                                downArrow.current.classList.toggle("hidden");
                                setToggle(false);
                            }
                            setActiveField("pickup");


                        }} />
                        <div className='relative '>
                            <div className='w-2 h-16 bg-black absolute -top-9 left-4 rounded-full animate-bounce'></div>
                        </div>

                        <input type="text" required name="destination-location" id="destination-location" placeholder='Enter destination location' className='py-2 px-7 pl-10 text-lg outline-gray-600 bg-[#eee] w-full rounded-md mb-2' value={rideData.destination} onChange={(e) => {
                            setRideData((prevState) => ({ ...prevState, destination: e.target.value }))
                            // handleChange(e);
                            setQuery(e.target.value);

                        }

                        } onClick={(e) => {

                            if (toggle) {
                                container.current.classList.add("h-screen")
                                locationRef.current.classList.toggle("grow-1");
                                locationRef.current.classList.toggle("py-4");
                                downArrow.current.classList.toggle("hidden");
                                setToggle(false);
                            }
                            setActiveField("destination");
                            // handleChange(e);


                        }} />
                        <button className='bg-black text-white rounded-lg w-full p-2 text-xl font-semibold mt-4'>Ok</button>

                    </form>
                </div>


                <LocationSearchPanel locationRef={locationRef} suggestions={suggestions} activeField={activeField} setRideData={setRideData} />



            </div>


            <VehiclePanel vehicleRef={vehicleRef} confirmRideRef={confirmRideRef} PanelOpenClose={PanelOpenClose} />
            <ConfirmRide confirmRideRef={confirmRideRef} lookingForDriverRef={lookingForDriverRef} PanelOpenClose={PanelOpenClose} />
            <LookingForDriver lookingForDriverRef={lookingForDriverRef} waitingForDriverRef={waitingForDriverRef} PanelOpenClose={PanelOpenClose} setRideInfo={setRideInfo} />
            <WaitingForDriver waitingForDriverRef={waitingForDriverRef} PanelOpenClose={PanelOpenClose} rideInfo={rideInfo} />





        </div>
    )
}
export default Home;