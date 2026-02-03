'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import type { Offer } from '@/app/api/offers/types';
import { useRouter } from 'next/navigation'; // Import useRouter

// Custom marker icon
const customIcon = new Icon({
  iconUrl: '/homepage/location.svg', // Assuming you have a marker icon here
  iconSize: [38, 38], // size of the icon
});

interface OffersOnMapProps {
  offers: Offer[];
}

export default function OffersOnMap({ offers }: OffersOnMapProps) {
  const router = useRouter(); // Initialize useRouter

  // Default to Krakow's coordinates if no offers or offers don't have location
  const defaultPosition: [number, number] = [50.0647, 19.945]; // Krakow coordinates

  return (
    <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {offers.map((offer) => {
        if (offer.latitude && offer.longitude) {
          return (
            <Marker key={offer.id} position={[offer.latitude, offer.longitude]} icon={customIcon}>
              <Popup>
                <div 
                  onClick={() => router.push(`/offer/${offer.id}`)}
                  style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
                >
                  <b>{offer.title}</b><br />
                  {offer.address}<br />
                  Price: {offer.price} PLN
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}
