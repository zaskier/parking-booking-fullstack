'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOfferFormStore, OfferType, OfferFormData } from '../../../../store/useOfferFormStore';
import { getCoordsForAddress } from '@/utils/geocoding/getCoordsForAddress';
import { supabase } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function EditOfferPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const {
    formData,
    photo,
    imageUrl,
    errors,
    isFormValid,
    submitting,
    setFormData,
    setPhoto,
    setImageUrl,
    setErrors,
    setSubmitting,
    resetForm,
    validateAllFields
  } = useOfferFormStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const authorizeAndFetchOffer = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setUnauthorized(true);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/offers/${id}`);
        if (!response.ok) throw new Error('Failed to fetch offer data.');
        const offerData = await response.json();

        if (offerData.email === user.email) {
          setFormData({
            title: offerData.title,
            content: offerData.content,
            price: offerData.price.toString(),
            city: offerData.city,
            address: offerData.address,
            type: offerData.type
          });
          setImageUrl(offerData.image);
          setPreviewUrl(offerData.image);
          setIsAuthorized(true);
        } else {
          setUnauthorized(true);
        }
      } catch (err: any) {
        setErrors({ form: err.message });
      } finally {
        setLoading(false);
      }
    };

    authorizeAndFetchOffer();
  }, [id, setFormData, setImageUrl, setErrors]);

  useEffect(() => {
    if (unauthorized) {
      router.push('/');
    }
  }, [unauthorized, router]);

  useEffect(() => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (imageUrl) {
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [photo, imageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: keyof OfferFormData; value: string };
    setFormData({ [name]: value });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhoto(file);

      const photoFormData = new FormData();
      photoFormData.append('file', file);
      try {
        const uploadResponse = await fetch(`http://localhost:8080/offers/upload`, {
          method: 'POST',
          body: photoFormData
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload photo.');
        const uploadResult = await uploadResponse.json();
        setImageUrl(uploadResult.url);
      } catch (err: any) {
        setErrors({ ...errors, photo: err.message });
      }
    } else {
      setPhoto(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    setSubmitting(true);

    try {
      const coords = await getCoordsForAddress(formData.address);
      const offerData = {
        ...formData,
        price: parseFloat(formData.price),
        image: imageUrl,
        latitude: coords?.lat,
        longitude: coords?.lon
      };

      const response = await fetch(`/api/offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update offer.');
      }

      resetForm();
      router.push(`/offer/${id}`);
    } catch (err: any) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || unauthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-deep-dusk">Edit Parking Offer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
        {/* Form fields are identical to add-offer page, so they are omitted for brevity but would be included here */}
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
            className="w-full rounded-md border p-2"
            required
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
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
            className="w-full rounded-md border p-2"
            rows={4}
            required
          />
          {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
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
            className="w-full rounded-md border p-2"
            required
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
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
            className="w-full rounded-md border p-2"
            required
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
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
            className="w-full rounded-md border p-2"
            required
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
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
            className="w-full rounded-md border p-2">
            {Object.values(OfferType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700">Photo</label>
          {previewUrl && <Image src={previewUrl} alt="Preview" width={200} height={200} />}
          <input
            id="photo"
            name="photo"
            type="file"
            onChange={handlePhotoChange}
            className="w-full text-sm"
            accept="image/*"
          />
          {errors.photo && <p className="mt-1 text-xs text-red-500">{errors.photo}</p>}
        </div>
        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-main-blue px-5 py-3 text-white">
          {submitting ? 'Updating...' : 'Update Offer'}
        </button>
      </form>
    </div>
  );
}
