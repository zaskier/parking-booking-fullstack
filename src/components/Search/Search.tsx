import { useState, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import findAddOffer from '../../../public/homepage/find-add-offer.svg';

import Dropdown from '@/components/Homepage/Dropdown';
import Offers from '@/components/Offers/Offers';

const cities = require('./cities.json');
// Custom Input for DatePicker
const CustomDateRangeInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <div className="relative w-full" onClick={onClick}>
      <input
        ref={ref}
        value={value}
        readOnly
        className="w-full cursor-pointer rounded-md bg-main-gray p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Select a date range"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-gray-400">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          />
        </svg>
      </div>
    </div>
  )
);
CustomDateRangeInput.displayName = 'CustomDateRangeInput';

export default function Search({}) {
  enum ParkingType {
    Guarded = 'Guarded',
    Monitored = 'Monitored',
    Any = 'Any'
  }

  const [city, setCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(true);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
    setShowCityDropdown(true);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCityDropdown(false);
  };

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), null]);
  const [startDate, endDate] = dateRange;

  const parkingTypeOptions = Object.values(ParkingType);
  const [selectedParkingType, setSelectedParkingType] = useState<ParkingType>(ParkingType.Any);
  const handleParkingType = (parkingType: string) => {
    setSelectedParkingType(parkingType as ParkingType);
  };

  // State to control the visibility of the offers
  const [showResults, setShowResults] = useState(false);

  const handleShowOffers = () => {
    if (city) {
      setShowResults(true);
      setShowCityDropdown(false);
    } else {
      // Optional: show an error or a hint to select a city first
      console.log('Please select a city first.');
    }
  };

  return (
    <>
      <div className="Parent content-background flex w-full flex-row rounded-lg bg-main-gray bg-cover bg-center bg-no-repeat p-4 text-xs md:text-base">
        <section className="section-1 w-full min-w-64 rounded-lg bg-white md:max-2xl:w-1/2">
          <ul className="m-3 mt-auto flex w-full flex-row whitespace-nowrap pr-1 text-center dark:border-gray-700 dark:text-gray-400">
            <li className="me-2 w-full">
              <a className="inline-block rounded-t-lg p-4">Find Parking</a>
            </li>
            <li className="me-2 w-full">
              <Link
                href="offer/add"
                aria-current="page"
                className="active inline-block w-full rounded-t-lg bg-gray-100 p-4 text-blue-100 dark:bg-main-blue dark:text-white">
                Add Parking Offer
              </Link>
            </li>
          </ul>

          <div className="relative pr-6">
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              className="mx-3 mb-3 w-full rounded-md bg-main-gray p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Where"
            />
            {showCityDropdown && (
              <div className="center absolute z-50 w-full rounded-md bg-white shadow-md">
                {cities
                  .filter((item: any) => {
                    const searchTerm = city.toLowerCase();
                    const cityName = item.city.toLowerCase();
                    return searchTerm && cityName.startsWith(searchTerm) && cityName !== searchTerm;
                  })
                  .slice(0, 5) // Limit results for better UX
                  .map((item: any) => (
                    <div
                      onClick={() => handleCitySelect(item.city)}
                      className="w m-3 my-0.5 cursor-pointer p-2 text-left hover:bg-gray-100"
                      key={item.city}>
                      {item.city}
                    </div>
                  ))}
              </div>
            )}

            <div className="mx-3 flex w-full flex-row rounded-md bg-main-gray">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={false}
                customInput={<CustomDateRangeInput />}
                className="w-full" // Add w-full here for the wrapper div
              />
            </div>

            <div className="m-3 flex w-full flex-row">
              <div className="mr-3 w-full rounded-md bg-main-gray px-4 py-4 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <Dropdown
                  label="Parking Type"
                  options={parkingTypeOptions}
                  onSelect={handleParkingType}
                />
              </div>
              <button
                onClick={handleShowOffers}
                className="whitespace-nowrap rounded-md bg-deep-dusk px-5 py-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                Show offers
              </button>
            </div>
          </div>
        </section>
        <Image
          className="section-2 md:max-xl:z-1 inset-0 w-0 object-cover md:w-1/2"
          src={findAddOffer}
          alt="checkbox"
        />
      </div>
      {/* Conditionally render the Offers component */}
      {showResults && <Offers city={city} parkingType={selectedParkingType} />}
    </>
  );
}
