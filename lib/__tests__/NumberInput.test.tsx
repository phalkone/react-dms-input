import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { NumberInput } from '../NumberInput'

const locale = 'en'

describe('NumberInput Component', () => {
  it('renders with correct placeholder', () => {
    const setValue = vi.fn()
    const { getByPlaceholderText } = render(
      <NumberInput
        value=""
        setValue={setValue}
        max={90}
        decimals={0}
        locale={locale}
      />
    )

    const input = getByPlaceholderText('00')
    expect(input).toBeDefined()
  })

  it('allows valid input and calls setValue on change', () => {
    const setValue = vi.fn()
    const { getByPlaceholderText } = render(
      <NumberInput
        value=""
        setValue={setValue}
        max={90}
        decimals={0}
        locale={locale}
      />
    )
    const input = getByPlaceholderText('00') as HTMLInputElement
    fireEvent.input(input, { target: { value: '12' } })
    expect(setValue).toHaveBeenCalledWith('12')
  })

  it('rejects invalid input (value too high) and reverts to last valid value', () => {
    const setValue = vi.fn()

    const { getByPlaceholderText } = render(
      <NumberInput
        value="12"
        setValue={setValue}
        max={90}
        decimals={0}
        locale={locale}
      />
    )
    const input = getByPlaceholderText('00') as HTMLInputElement
    input.dataset.lastValidValue = '12'
    fireEvent.input(input, { target: { value: '100' } })
    expect(input.value).toBe('12')
  })

  it('focuses nextFocus when input length equals placeholder length', () => {
    const setValue = vi.fn()
    const nextFocus = { focus: vi.fn() } as unknown as HTMLInputElement
    const { getByPlaceholderText } = render(
      <NumberInput
        value=""
        setValue={setValue}
        max={90}
        decimals={0}
        locale={locale}
        nextFocus={nextFocus}
      />
    )
    const input = getByPlaceholderText('00') as HTMLInputElement

    fireEvent.input(input, { target: { value: '12' } })
    expect(nextFocus.focus).toHaveBeenCalled()
  })

  it('focuses previousFocus on backspace when value is empty', () => {
    const setValue = vi.fn()
    const previousFocus = { focus: vi.fn() } as unknown as HTMLInputElement
    const { getByPlaceholderText } = render(
      <NumberInput
        value=""
        setValue={setValue}
        max={90}
        decimals={0}
        locale={locale}
        previousFocus={previousFocus}
      />
    )
    const input = getByPlaceholderText('00') as HTMLInputElement

    fireEvent.keyUp(input, { key: 'Backspace' })
    expect(previousFocus.focus).toHaveBeenCalled()
  })

  it('formats the value on blur', () => {
    const setValue = vi.fn()
    const { getByPlaceholderText } = render(
      <NumberInput
        value="12"
        setValue={setValue}
        max={90}
        decimals={0}
        locale={locale}
      />
    )
    const input = getByPlaceholderText('00') as HTMLInputElement
    fireEvent.blur(input)

    expect(setValue).toHaveBeenCalled()
  })
})
