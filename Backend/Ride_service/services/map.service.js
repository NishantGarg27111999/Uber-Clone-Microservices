const axios=require('axios');
// const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate=async( address )=>{
    const apikey='';
    const url=`https://maps.gomaps.pro/maps/api/geocode/json?key=${apikey}&address=${address}`;

    try{
        const response=await axios.get(url);
        console.log(response);
        if(response.data.status==='OK'){
            const location=response.data.results[0].geometry.location;
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
    const apikey='';
    const url=`https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&key=${apikey}`;

    try{
        const response=await axios.get(url);
        if(response.data.status==='OK'){
            console.log(response);
            if(response.data.rows[0].elements[0].status==='ZERO_RESULTS'){
                throw new Error('No routes found');

            }
            return response.data.rows[0].elements[0];
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
    const apikey='';
    const url=`https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${apikey}`;

    try{
        const response=await axios.get(url);
        // console.log(response);
        console.log('waiti');
        if( response.data.status==='OK'){
            return response.data.predictions;s
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

