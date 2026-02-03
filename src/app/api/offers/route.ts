import { NextResponse } from 'next/server';

/**
 * API handler for fetching parking offers from the backend.
 * Supports filtering by city via a query parameter.
 * @param request The incoming Next.js API request object.
 * @returns A JSON response with the filtered or full list of offers.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  try {
    let url = 'http://localhost:8080/offers';
    if (city) {
      url += `?city=${encodeURIComponent(city)}`;
    }
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch offers from backend: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching offers from backend:', error);
    return NextResponse.json({ message: 'Error fetching offers', error: error.message }, { status: 500 });
  }
}

/**
 * API handler for adding a new parking offer.
 * @param request The incoming Next.js API request object.
 * @returns A JSON response with the newly created offer.
 */
export async function POST(request: Request) {
  try {
    const newOfferData = await request.json();
    const response = await fetch('http://localhost:8080/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOfferData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create offer in backend: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error creating offer in backend:', error);
    return NextResponse.json({ message: 'Error creating offer', error: error.message }, { status: 500 });
  }
}
