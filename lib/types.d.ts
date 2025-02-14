export interface DMSInputProps {
  type: 'lat' | 'long'
  seconds?: boolean
  minutesDecimals?: 0 | 1 | 2 | 3
  value?: number
  onChange?: (val: number | undefined) => void
  nextFocus?: HTMLInputElement | HTMLSelectElement | null
}

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  min?: number
  max: number
  decimals: 0 | 1 | 2 | 3
  nextFocus?: HTMLInputElement | HTMLSelectElement | null
  previousFocus?: HTMLInputElement | HTMLSelectElement | null
}

export interface SignInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: ['N', 'S'] | ['E', 'W']
  value?: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  onChange?: (val: string) => void
  nextFocus?: HTMLInputElement | HTMLSelectElement | null
}
