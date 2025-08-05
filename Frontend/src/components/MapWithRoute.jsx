// MapWithRoute.jsx

import React, { useContext, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { rideDataContext } from '../contexts/RideContext';
import axios from 'axios';
import InitialMap from '../pages/InitialMap';
import FitBounds from './FitBounds';
import L from 'leaflet';

export default function MapWithRoute({captainLocation}) {
    //   const pickup = { lat: 28.6139, lng: 77.2090 }; // New Delhi
    //   const destination = { lat: 28.5355, lng: 77.3910 }; // Noida

    const [routeCoords, setRouteCoords] = useState([]);
    const { ride } = useContext(rideDataContext);
    console.log(ride);
    //   const [pickUpCor,setPickUpCor]=useState("");
    //   const []

    const [pickup, setPickUp] = useState(null);
    const [destination, setDestination] = useState(null);
    const markerRef = useRef(null);

    const captainIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    useEffect(() => {
        if (markerRef.current && captainLocation) {
            markerRef.current.setLatLng([captainLocation.lat, captainLocation.lng]);
        }
        console.log("lction update");
    }, [captainLocation]);





    useEffect(() => {
        if (!ride) return;                 // safety if context is still loading

        const fetchCoords = async () => {
            const token = localStorage.getItem('token');
            const base = import.meta.env.VITE_BASE_URL;

            const [pResp, dResp] = await Promise.all([
                axios.get(`${base}/ride/map/get-coordinates`, {
                    params: { address: ride.pickUp },
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${base}/ride/map/get-coordinates`, {
                    params: { address: ride.destination },
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setPickUp({
                lat: pResp.data.ltd,
                lng: pResp.data.lng
            });          // e.g. { lat: 28.6139, lng: 77.2090 }
            setDestination({
                lat: dResp.data.ltd,
                lng: dResp.data.lng
            });      // e.g. { lat: 28.5355, lng: 77.3910 }
        };

        fetchCoords();
    }, [ride]);


    useEffect(() => {
        const getRoute = async () => {
            if (!pickup || !destination) return;
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoords(coords);
        };

        getRoute();
    }, [pickup, destination])

    console.log(pickup);
    console.log(destination);

    if (!pickup || !destination) return <InitialMap />;

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const greenIcon = new L.Icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],       // size of the icon
        iconAnchor: [12, 41],     // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34],    // point from which the popup should open relative to the iconAnchor
        shadowSize: [41, 41]      // size of the shadow
    });


    return (
        (pickup != null && destination != null) ? <MapContainer center={pickup} zoom={11} style={{ height: '100vh', width: '100%', zIndex: 0, pointerEvents: 'auto' }} zoomControl={false} scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            touchZoom={true}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[pickup.lat, pickup.lng]} icon={greenIcon} />
            <Marker position={[destination?.lat, destination?.lng]} icon={redIcon} />
            {captainLocation && (
                <Marker
                    position={[captainLocation.lat, captainLocation.lng]}
                    icon={captainIcon}
                    ref={markerRef}
                />
            )}
            <FitBounds pickup={pickup} destination={destination} />
            {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="blue" weight={5} />
            )}
        </MapContainer> : <InitialMap />
    );
}
