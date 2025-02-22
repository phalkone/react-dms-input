import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { escapeForRegex, formatNumber, getDecimalSeparator } from './helper'

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  min?: number
  max: number
  decimals: 0 | 1 | 2 | 3 | 4
  locale?: string
  nextFocus?: HTMLInputElement | HTMLSelectElement | null
  previousFocus?: HTMLInputElement | HTMLSelectElement | null
}

export const NumberInput = forwardRef(function NumberInput(
  {
    value,
    setValue,
    min = 0,
    max,
    decimals = 2,
    locale,
    nextFocus,
    previousFocus,
    ...otherProps
  }: NumberInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const integer = Math.trunc(max).toString().length
  const placeholder = useMemo(
    () => formatNumber('0', integer, decimals, locale),
    [integer, decimals, locale]
  )
  const separator = useMemo(
    () => escapeForRegex(getDecimalSeparator(locale)),
    [locale]
  )
  const pattern = useMemo(
    () =>
      decimals > 0
        ? new RegExp(`^\\d{0,${integer}}(${separator}\\d{0,${decimals}})?$`)
        : new RegExp(`^\\d{0,${integer}}$`),
    [integer, decimals, separator]
  )
  const spanRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState('auto')

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const val = input.value

    const numericValue = parseFloat(val)
    if (!pattern.test(val) || (!isNaN(numericValue) && numericValue > max)) {
      input.value = input.dataset.lastValidValue || ''
      return
    }

    input.dataset.lastValidValue = val
    if (val.length === placeholder.length) nextFocus?.focus()
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Focus on previous when deleting
    if (e.key === 'Backspace' && value.length === 0) {
      previousFocus?.focus()
    }
  }

  const blurDegrees = () => {
    if (value) setValue((val) => formatNumber(val, integer, decimals, locale))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  useEffect(() => {
    if (spanRef.current) {
      setWidth(`${spanRef.current.offsetWidth}px`)
    }
  }, [placeholder])

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <span
        ref={spanRef}
        style={{
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          position: 'absolute',
          fontSize: '1rem',
          padding: '0.3rem'
        }}
      >
        {placeholder}
      </span>
      <input
        type="text"
        min={min}
        max={max}
        maxLength={placeholder.length}
        placeholder={placeholder}
        required
        onBlur={blurDegrees}
        onFocus={handleFocus}
        onKeyUp={handleKeyUp}
        onInput={handleInput}
        inputMode={decimals === 0 ? 'numeric' : 'decimal'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={ref}
        style={{ width }}
        {...otherProps}
      />
    </div>
  )
})
