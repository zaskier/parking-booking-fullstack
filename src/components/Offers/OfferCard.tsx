import Image from 'next/image';
import Link from 'next/link';
import type { Offer } from '@/app/api/offers/types';

interface OfferCardProps {
  offer: Offer;
  editMode?: boolean; // New prop
}

export default function OfferCard({ offer, editMode }: OfferCardProps) {
  const linkHref = editMode ? `/offer/edit/${offer.id}` : `/offer/${offer.id}`;

  return (
    <Link href={linkHref} className="block h-full">
      <div className="m-2 flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 text-lg font-bold text-deep-dusk">
            {offer.title}
          </h3>
          <p className="mb-1 text-sm text-gray-600">{offer.city}</p>
          <p className="mb-4 flex-grow text-sm text-gray-700">
            {offer.content}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-main-blue">
              ${offer.price}
            </span>
            {offer.type && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  offer.type === 'Guarded'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {offer.type}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
