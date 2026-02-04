'use client';

import { useState, useEffect } from 'react';
import type { Offer } from '@/app/api/offers/types';
import OfferCard from '@/components/Offers/OfferCard';
import { supabase } from '@/utils/supabase/client';

export default function MyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user email from Supabase
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        setError("User not logged in.");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userEmail) {
      if (!loading) setOffers([]); // Only clear if not still fetching user
      return;
    }

    setLoading(true);
    setError(null);

    const fetchMyOffers = async () => {
      try {
        const response = await fetch(`/api/offers?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch my offers');
        }
        const data: Offer[] = await response.json();
        setOffers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOffers();
  }, [userEmail]);

  if (loading) {
    return <div className="p-4 text-center">Loading your offers...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (offers.length === 0) {
    return <div className="p-4 text-center text-gray-500">No offers found for your account.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Offers</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
