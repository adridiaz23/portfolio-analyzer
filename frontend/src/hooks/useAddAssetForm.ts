// useAddAssetForm — handles form state and validation for the Add Asset modal
// Keeping this logic separate from the UI component makes both easier to test
import { useState } from 'react'
import type { AssetType } from '@/types'

interface FormState {
  ticker: string
  name: string
  type: AssetType
  quantity: string
  buyPrice: string
}

interface FormErrors {
  ticker?: string
  quantity?: string
  buyPrice?: string
}

const INITIAL_STATE: FormState = {
  ticker: '',
  name: '',
  type: 'stock',
  quantity: '',
  buyPrice: '',
}

export function useAddAssetForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})

  // Update a single field and clear its error as the user types
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  // Run all validations and return whether the form is valid
  function validate(): boolean {
    const next: FormErrors = {}

    if (!form.ticker.trim()) {
      next.ticker = 'Ticker is required'
    } else if (form.ticker.trim().length > 10) {
      next.ticker = 'Ticker must be 10 characters or less'
    }

    if (!form.quantity) {
      next.quantity = 'Quantity is required'
    } else if (parseFloat(form.quantity) <= 0) {
      next.quantity = 'Quantity must be greater than 0'
    }

    if (!form.buyPrice) {
      next.buyPrice = 'Buy price is required'
    } else if (parseFloat(form.buyPrice) <= 0) {
      next.buyPrice = 'Price must be greater than 0'
    }

    setErrors(next)
    // Form is valid when there are no error messages
    return Object.keys(next).length === 0
  }

  function reset() {
    setForm(INITIAL_STATE)
    setErrors({})
  }

  return { form, errors, setField, validate, reset }
}