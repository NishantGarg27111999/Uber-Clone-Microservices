import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function FitBounds({ pickup, destination }) {
  const map = useMap();

  useEffect(() => {
    if (pickup && destination) {
      const bounds = [
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng]
      ];
      map.fitBounds(bounds, {
        padding: [50, 50],animate: true
      });
    }
  }, [pickup, destination, map]);

  return null; // no UI
}
