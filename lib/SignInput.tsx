import { ForwardedRef, forwardRef } from 'react'
import { SignInputProps } from './types'

export const SignInput = forwardRef(function SignInput(
  { options, value, setValue, nextFocus }: SignInputProps,
  ref: ForwardedRef<HTMLSelectElement>
) {
  const handleSignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
    nextFocus?.focus()
  }

  return (
    <select ref={ref} value={value} onChange={handleSignChange}>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  )
})
