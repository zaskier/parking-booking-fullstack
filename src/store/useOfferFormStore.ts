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
  type: OfferType
}

export interface OfferFormErrors {
  title?: string
  content?: string
  price?: string
  city?: string
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
    default:
      return undefined
  }
}

interface OfferFormState {
  formData: OfferFormData
  photo: File | null
  errors: OfferFormErrors
  isFormValid: boolean
  submitting: boolean

  setFormData: (data: Partial<OfferFormData>) => void
  setPhoto: (file: File | null) => void
  setErrors: (errors: OfferFormErrors) => void
  setSubmitting: (submitting: boolean) => void
  resetForm: () => void
  validateForm: () => void
  validateAllFields: () => boolean
}

export const useOfferFormStore = create<OfferFormState>((set, get) => ({
  formData: {
    title: '',
    content: '',
    price: '',
    city: '',
    type: OfferType.Guarded,
  },
  photo: null,
  errors: {},
  isFormValid: false,
  submitting: false,

  setFormData: (data) => {
    set((state) => {
      const newErrors = { ...state.errors }
      Object.entries(data).forEach(([key, value]) => {
        const error = validateField(key as keyof OfferFormData, value as string)
        if (error) {
          newErrors[key as keyof OfferFormErrors] = error
        } else {
          delete newErrors[key as keyof OfferFormErrors]
        }
      })
      return { formData: { ...state.formData, ...data }, errors: newErrors }
    })
    get().validateForm()
  },
  setPhoto: (file) => {
    set((state) => ({
      photo: file,
      errors: { ...state.errors, photo: undefined },
    }))
    get().validateForm()
  },
  setErrors: (errors) => {
    set({ errors })
    get().validateForm()
  },
  setSubmitting: (submitting) => set({ submitting }),
  resetForm: () =>
    set({
      formData: {
        title: '',
        content: '',
        price: '',
        city: '',
        type: OfferType.Guarded,
      },
      photo: null,
      errors: {},
      isFormValid: false,
      submitting: false,
    }),
  validateForm: () => {
    const { formData, photo, errors } = get()
    const hasErrors = Object.values(errors).some((error) => !!error)
    const allFieldsFilled = Object.values(formData).every((field) => field)
    const isValid = !hasErrors && allFieldsFilled && !!photo
    set({ isFormValid: isValid })
  },
  validateAllFields: () => {
    const { formData, photo } = get()
    const newErrors: OfferFormErrors = {}
    let isValid = true

    ;(Object.keys(formData) as Array<keyof OfferFormData>).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key as keyof OfferFormErrors] = error
        isValid = false
      }
    })

    if (!photo) {
      newErrors.photo = 'A photo is required.'
      isValid = false
    }

    set({ errors: newErrors })
    get().validateForm()
    return isValid
  },
}))
