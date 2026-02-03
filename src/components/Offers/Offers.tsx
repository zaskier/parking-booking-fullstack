'use client';

import { useState, useEffect } from 'react';
import type { Offer } from '@/app/api/offers/types';
import OfferCard from './OfferCard';
import dynamic from 'next/dynamic';

const OffersOnMap = dynamic(() => import('./OffersOnMap'), { ssr: false });

interface OffersProps {
  city: string;
  parkingType: 'Guarded' | 'Monitored' | 'Any' | '';
}

export default function Offers({ city, parkingType }: OffersProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) {
      setOffers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchOffers = async () => {
      try {
        const response = await fetch(`/api/offers?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }
        const data: Offer[] = await response.json();
        
        // Client-side filtering for parkingType
        if (parkingType && parkingType !== 'Any') {
          setOffers(data.filter(offer => offer.type === parkingType));
        } else {
          setOffers(data);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [city, parkingType]);

  if (!city) {
    return <div className="p-4 text-center text-gray-500">Please select a city to see offers.</div>;
  }

  if (loading) {
    return <div className="p-4 text-center">Loading offers...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (offers.length === 0) {
    return <div className="p-4 text-center text-gray-500">No offers found for the selected criteria.</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <OffersOnMap offers={offers} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
