'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOfferFormStore, OfferType, OfferFormData } from '../../../store/useOfferFormStore';
import { getCoordsForAddress } from '../../../utils/geocoding/getCoordsForAddress';

export default function AddOfferPage() {
  const router = useRouter();
  const {
    formData,
    photo,
    errors,
    touched,
    submitting,
    setFormData,
    setPhoto,
    setImageUrl,
    setErrors,
    setTouched,
    setSubmitting,
    resetForm,
    validateField,
    validateAllFields
  } = useOfferFormStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load form data from local storage on mount without validation
  useEffect(() => {
    const savedData = localStorage.getItem('offerFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse form data', e);
      }
    } else {
      resetForm();
    }
  }, [resetForm, setFormData]);

  // Persist form data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('offerFormData', JSON.stringify(formData));
  }, [formData]);

  // Update image preview when photo changes
  useEffect(() => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [photo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: keyof OfferFormData; value: string };
    setFormData({ [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof OfferFormData; value: string };
    setTouched({ [name]: true });
    validateField(name, value);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhoto(file);

      // Upload the photo immediately
      const photoFormData = new FormData();
      photoFormData.append('file', file);

      try {
        const uploadResponse = await fetch(`http://localhost:8080/offers/image`, {
          method: 'POST',
          body: photoFormData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload photo.');
        }

        const uploadResult = await uploadResponse.json();
        setImageUrl(uploadResult.url);
      } catch (err: any) {
        setErrors({ ...errors, photo: err.message });
      }
    } else {
      setPhoto(null);
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAllFields();
    if (!isValid || !useOfferFormStore.getState().imageUrl) {
      if (!useOfferFormStore.getState().imageUrl) {
        setErrors({ ...errors, photo: 'Please upload a photo.' });
      }
      return;
    }

    setSubmitting(true);

    try {
      const coords = await getCoordsForAddress(formData.address);

      const offerData = {
        ...formData,
        price: parseFloat(formData.price),
        image: useOfferFormStore.getState().imageUrl,
        latitude: coords?.lat,
        longitude: coords?.lon
      };

      const offerResponse = await fetch(`http://localhost:8080/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
      });

      if (!offerResponse.ok) {
        const errorData = await offerResponse.json();
        throw new Error(errorData.message || 'Failed to submit offer.');
      }

      const newOffer = await offerResponse.json();
      localStorage.removeItem('offerFormData');
      resetForm();
      router.push(`/offer/${newOffer.id}`);
    } catch (err: any) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-deep-dusk">Add a New Parking Offer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
        {/* Form fields */}
        <div>
          <label htmlFor="title" className="mb-1 block font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Secure Underground Parking"
            className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${touched.title && errors.title ? 'border-red-500 ring-red-500' : 'focus:ring-main-blue'}`}
            required
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>
        <div>
          <label htmlFor="content" className="mb-1 block font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Details about the parking spot"
            className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${touched.content && errors.content ? 'border-red-500 ring-red-500' : 'focus:ring-main-blue'}`}
            rows={4}
            required
          />
          {touched.content && errors.content && (
            <p className="mt-1 text-xs text-red-500">{errors.content}</p>
          )}
        </div>
        <div>
          <label htmlFor="price" className="mb-1 block font-medium text-gray-700">
            Price per day (USD)
          </label>
          <input
            id="price"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 25.50"
            className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${touched.price && errors.price ? 'border-red-500 ring-red-500' : 'focus:ring-main-blue'}`}
            required
          />
          {touched.price && errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
          )}
        </div>
        <div>
          <label htmlFor="city" className="mb-1 block font-medium text-gray-700">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., New York"
            className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${touched.city && errors.city ? 'border-red-500 ring-red-500' : 'focus:ring-main-blue'}`}
            required
          />
          {touched.city && errors.city && (
            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
          )}
        </div>
        <div>
          <label htmlFor="address" className="mb-1 block font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 123 Main St"
            className={`w-full rounded-md border p-2 focus:outline-none focus:ring-1 ${touched.address && errors.address ? 'border-red-500 ring-red-500' : 'focus:ring-main-blue'}`}
            required
          />
          {touched.address && errors.address && (
            <p className="mt-1 text-xs text-red-500">{errors.address}</p>
          )}
        </div>
        <div>
          <label htmlFor="type" className="mb-1 block font-medium text-gray-700">
            Offer Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-md border p-2 focus:outline-none focus:ring-1 focus:ring-main-blue">
            {Object.values(OfferType).map((type: string) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Photo upload section */}
        <div>
          <label className="mb-1 block font-medium text-gray-700">Photo</label>
          <div className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-2 transition-colors hover:border-main-blue">
            {previewUrl ? (
              <div className="group relative h-full w-full">
                <Image src={previewUrl} alt="Preview" fill className="object-contain" unoptimized />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500">
                <span>Click to Upload</span>
                <span className="text-xs">(1 photo required)</span>
              </label>
            )}
          </div>
          <div className="mt-2">
            <input
              id="photo"
              name="photo"
              type="file"
              onChange={handlePhotoChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-main-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-deep-dusk"
              accept="image/*"
            />
            {touched.photo && errors.photo && (
              <p className="mt-1 text-xs text-red-500">{errors.photo}</p>
            )}
          </div>
        </div>

        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-main-blue px-5 py-3 text-white hover:bg-deep-dusk focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Add Offer'}
        </button>
      </form>
    </div>
  );
}
