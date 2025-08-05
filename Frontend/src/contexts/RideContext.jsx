import { createContext,useState } from "react";

export const rideDataContext=createContext();
function RideContext({children}){
    const [ride,setRide]=useState({pickUp:"",
        destination:"",
        fare:{
            car:"",
            auto:"",
            bike:""
        },
        vehicleType:""
    });

    return (
        <rideDataContext.Provider value={{ride,setRide}}>
            {children}
        </rideDataContext.Provider>
    )
}

export default RideContext;