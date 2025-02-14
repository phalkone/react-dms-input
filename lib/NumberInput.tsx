import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { formatNumber } from './helper'
import { NumberInputProps } from './types'

export const NumberInput = forwardRef(function NumberInput(
  {
    value,
    setValue,
    min = 0,
    max,
    decimals = 2,
    nextFocus,
    previousFocus,
    ...otherProps
  }: NumberInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const integer = Math.trunc(max).toString().length
  const placeholder = formatNumber('0', integer, decimals)
  const pattern =
    decimals > 0
      ? new RegExp(`^\\d{0,${integer}}([\\.,]\\d{0,${decimals}})?$`)
      : new RegExp(`^\\d{0,${integer}}$`)
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
    if (value) setValue((val) => formatNumber(val, integer, decimals))
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
