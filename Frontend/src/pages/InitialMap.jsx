// UserLocationMap.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import map from '../assets/map.gif'

export default function InitialMap() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Ask for user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location', error);
      }
    );
  }, []);

  if (!userLocation) {
    return <div><img src={map}/></div>;
  }

  return (
    <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%',zIndex:0,pointerEvents: 'auto' }} zoomControl={false} scrollWheelZoom={true}
  dragging={true}
  doubleClickZoom={true}
  touchZoom={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={userLocation}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
}
