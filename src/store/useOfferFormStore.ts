import { create } from 'zustand'

export enum OfferType {
  Guarded = 'Guarded',
  Monitored = 'Monitored',
  Any = 'Any',
}

export interface OfferFormData {
  title: string
  content: string
  price: string
  city: string
  address: string
  type: OfferType
}

export interface OfferFormErrors {
  title?: string
  content?: string
  price?: string
  city?: string
  address?: string
  photo?: string
  form?: string
}

const validateField = (
  name: keyof OfferFormData,
  value: string,
): string | undefined => {
  switch (name) {
    case 'title':
      return value.length < 3
        ? 'Title must be at least 3 characters long.'
        : undefined
    case 'content':
      return value.length < 15
        ? 'Description is too short. Please provide more details.'
        : undefined
    case 'price':
      const priceRegex = /^\d+(\.\d{1,2})?$/
      return !priceRegex.test(value)
        ? 'Please enter a valid number with up to 2 decimal places.'
        : undefined
    case 'city':
      return value.length > 100
        ? 'City name cannot exceed 100 characters.'
        : undefined
    case 'address':
      return value.length < 5
        ? 'Address must be at least 5 characters long.'
        : undefined
    default:
      return undefined
  }
}

interface OfferFormState {
  formData: OfferFormData
  photo: File | null
  imageUrl: string | null
  errors: OfferFormErrors
  touched: { [key in keyof OfferFormData]?: boolean }
  isFormValid: boolean
  submitting: boolean

  setFormData: (data: Partial<OfferFormData>) => void
  setPhoto: (file: File | null) => void
  setImageUrl: (url: string | null) => void
  setErrors: (errors: OfferFormErrors) => void
  setTouched: (touched: { [key in keyof OfferFormData]?: boolean }) => void
  setSubmitting: (submitting: boolean) => void
  resetForm: () => void
  validateField: (name: keyof OfferFormData, value: string) => void
  validateAllFields: () => boolean
}

export const useOfferFormStore = create<OfferFormState>((set, get) => ({
  formData: {
    title: '',
    content: '',
    price: '',
    city: '',
    address: '',
    type: OfferType.Guarded,
  },
  photo: null,
  imageUrl: null,
  errors: {},
  touched: {},
  isFormValid: false,
  submitting: false,

  setFormData: (data) => {
    set((state) => ({ formData: { ...state.formData, ...data } }));
  },
  setPhoto: (file) => {
    set((state) => ({
      photo: file,
      errors: { ...state.errors, photo: undefined },
    }));
  },
  setImageUrl: (url) => set({ imageUrl: url }),
  setErrors: (errors) => set({ errors }),
  setTouched: (touched) => set((state) => ({ touched: { ...state.touched, ...touched } })),
  setSubmitting: (submitting) => set({ submitting }),
  resetForm: () =>
    set({
      formData: {
        title: '',
        content: '',
        price: '',
        city: '',
        address: '',
        type: OfferType.Guarded,
      },
      photo: null,
      imageUrl: null,
      errors: {},
      touched: {},
      isFormValid: false,
      submitting: false,
    }),
  validateField: (name, value) => {
    const error = validateField(name, value);
    set((state) => ({
      errors: { ...state.errors, [name]: error },
    }));
  },
  validateAllFields: () => {
    const { formData, photo } = get()
    const newErrors: OfferFormErrors = {}
    let isValid = true

    const newTouched: { [key in keyof OfferFormData]?: boolean } = {};
    (Object.keys(formData) as Array<keyof OfferFormData>).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key as keyof OfferFormErrors] = error
        isValid = false
      }
    });

    if (!photo) {
      newErrors.photo = 'A photo is required.'
      isValid = false
    }

    set({ errors: newErrors, touched: newTouched });
    return isValid
  },
}));
