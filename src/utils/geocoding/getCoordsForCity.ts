export interface GeoCoordinates {
  lat: number;
  lon: number;
}

/**
 * Fetches the geographical coordinates for a given city using the Nominatim API.
 * @param city The name of the city.
 * @returns A promise that resolves to an object with lat and lon, or null if not found.
 */
export async function getCoordsForCity(city: string): Promise<GeoCoordinates | null> {
  if (!city) {
    return null;
  }

  const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`;

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
    console.error('Error fetching coordinates for city:', error);
    return null;
  }
}
