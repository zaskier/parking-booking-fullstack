'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import type { Offer } from '@/app/api/offers/types';
import { useRouter } from 'next/navigation';
import { getCoordsForCity, GeoCoordinates } from '@/utils/geocoding/getCoordsForCity';

// Custom marker icon
const customIcon = new Icon({
  iconUrl: '/homepage/location.svg',
  iconSize: [38, 38]
});

interface OffersOnMapProps {
  offers: Offer[];
  city: string;
}

// Set map view
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function OffersOnMap({ offers, city }: OffersOnMapProps) {
  const router = useRouter();
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([50.0647, 19.945]); // Default to Krakow

  useEffect(() => {
    const fetchCoords = async () => {
      if (city) {
        const coords = await getCoordsForCity(city);
        if (coords) {
          setMapCenter([coords.lat, coords.lon]);
        }
      }
    };
    fetchCoords();
  }, [city]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%' }}>
      <ChangeView center={mapCenter} zoom={13} />
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
                  style={{ cursor: 'pointer' }}>
                  <b>{offer.title}</b>
                  <br />
                  {offer.address}
                  <br />
                  Price: {offer.price} $/day
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
