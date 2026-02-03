'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import offers from '@/app/api/offers/__mocks__/offers.json'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '@/utils/supabase/client'

// Load Stripe outside of component render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
)

export default function OfferDetails({ params }: { params: { id: string } }) {
  const { id } = params
  const offer = offers.find((o) => o.id === parseInt(id))

  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [totalPrice, setTotalPrice] = useState(0)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (startDate && endDate && offer) {
      const start = startDate.getTime()
      const end = endDate.getTime()
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      // Ensure at least 1 day if same day or dates valid
      const days = diffDays === 0 ? 1 : diffDays

      const pricePerDay = offer.price
      if (!isNaN(pricePerDay)) {
        setTotalPrice(days * pricePerDay)
      }
    }
  }, [startDate, endDate, offer])

  // Get user email from Supabase
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.email) {
          setUserEmail(session.user.email)
        } else {
          setUserEmail('')
        }
      },
    )

    // Initial check
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  if (!offer) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Offer not found</h1>
        <Link href="/" className="text-blue-500 underline mt-4 block">
          Go back home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Offers
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Image */}
        <div className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Column: Details & Booking */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{offer.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-blue-600">
                {offer.price}
              </span>
              <span className="text-gray-500">/ day</span>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p className="text-lg">{offer.content}</p>
            {/* Display other details if available in json */}
            {offer.city && (
              <p className="mt-2">
                <strong>City:</strong> {offer.city}
              </p>
            )}
            {offer.type && (
              <p>
                <strong>Type:</strong> {offer.type}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Book your spot</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">
                  Total Price
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Link
                href={{
                  pathname: '/booking',
                  query: {
                    price: totalPrice,
                    offerId: offer.id,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                    userEmail: userEmail,
                    offerTitle: offer.title,
                  },
                }}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
