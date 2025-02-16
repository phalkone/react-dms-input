import { ForwardedRef, forwardRef, useCallback } from 'react'

export interface SignInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: ['N', 'S'] | ['E', 'W']
  value?: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  nextFocus?: HTMLInputElement | HTMLSelectElement | null
}

export const SignInput = forwardRef(function SignInput(
  { options, value, setValue, nextFocus, ...otherProps }: SignInputProps,
  ref: ForwardedRef<HTMLSelectElement>
) {
  const handleSignChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value)
      nextFocus?.focus()
    },
    [setValue, nextFocus]
  )

  return (
    <select ref={ref} value={value} onChange={handleSignChange} {...otherProps}>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  )
})
