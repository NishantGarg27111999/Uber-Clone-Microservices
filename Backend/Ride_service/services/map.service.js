const axios=require('axios');
// const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate=async( address )=>{
    const apikey=process.env.GOMAP_API_KEY;
    // const url=`https://maps.gomaps.pro/maps/api/geocode/json?key=${apikey}&address=${address}`;
    const url=`https://us1.locationiq.com/v1/search?key=${apikey}&q=${address}&format=json`

    try{
        const response=await axios.get(url);
        console.log(response);
        if(response.data.status==='OK'){
            // const location=response.data.results[0].geometry.location;
            const location=response.data[0];
            return {
                ltd: location.lat,
                lng: location.lng
            };
        }
        else{
            throw new Error("Unable to fetch cooridnates");
        }
    }
    catch(error){
        // console.log(error);
        throw error;
    }
}

module.exports.getDistanceTime=async(origin,destination)=>{
    const apikey=process.env.GOMAP_API_KEY;
    console.log('api key in map service: ', apikey);
    const originCoordinate=await module.exports.getAddressCoordinate(origin);
    const destCoordinate=await module.exports.getAddressCoordinate(destination);
    // const url=`https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=${apikey}`;

    const url=`https://us1.locationiq.com/v1/directions/driving/${originCoordinate.lng},${originCoordinate.ltd};${destCoordinate.lng},${destCoordinate.ltd}?key=${apikey}&overview=simplified&annotations=false`;

    try{
        const response=await axios.get(url);
        if(response.data.status==='OK'){
            console.log(response);
            // if(response.data.rows[0].elements[0].status==='ZERO_RESULTS'){
            //     throw new Error('No routes found');

            // }
            if(response.data.code!="Ok"){
                throw new Error('No routes found');

            }
            // return response.data.rows[0].elements[0];
            return {distance:{value:response?.data?.routes[0].distance},duration:{value:response?.data?.routes[0].duration}};
        }
        else{
            console.log("error2");
            throw new Error('Unable to fetch distance and time');
        }
    }
    catch(error){
        // console.log("error3");
        // console.log(error);
        throw error;
    }
}

module.exports.getAutoCompleteSuggestions=async(input)=>{
    const apikey=process.env.GOMAP_API_KEY;
    // const url=`https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${apikey}`;
    const url=` https://api.locationiq.com/v1/autocomplete?key=${apikey}&q=${input}`;

    try{
        const response=await axios.get(url);
        // console.log(response);
        console.log('waiti');
        if( response.data.status==='OK'){
            return response.data[0].display_name;
        }
        else{
            throw new Error('Unable to fetch suggestions');
        }
    }
    catch(err){
        // console.log(err);
        throw err;
    }
}

