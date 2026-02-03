import { GeoCoordinates } from './getCoordsForCity';

/**
 * Fetches the geographical coordinates for a given address using the Nominatim API.
 * @param address The street address.
 * @returns A promise that resolves to an object with lat and lon, or null if not found.
 */
export async function getCoordsForAddress(address: string): Promise<GeoCoordinates | null> {
  if (!address) {
    return null;
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates for address:', error);
    return null;
  }
}
