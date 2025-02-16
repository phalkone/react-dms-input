import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DMSInput from '../DMSInput'
import '@testing-library/jest-dom'

describe('DMSInput Component', () => {
  const locale = 'en'

  it('renders correctly without seconds', () => {
    const onChange = vi.fn()
    render(
      <DMSInput
        type="lat"
        value={12.345}
        seconds={false}
        minutesDecimals={1}
        locale={locale}
        onChange={onChange}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(2)

    expect(screen.getByText('°')).toBeDefined()
    expect(screen.getByText("'")).toBeDefined()

    const signSelect = screen.getByRole('combobox')
    expect(signSelect).toBeDefined()
    expect(signSelect).toHaveValue('N')
  })

  it('renders correctly with seconds', () => {
    const onChange = vi.fn()
    render(
      <DMSInput
        type="lat"
        value={12.345}
        seconds={true}
        minutesDecimals={1}
        locale={locale}
        onChange={onChange}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(3)

    expect(screen.getByText('°')).toBeDefined()
    expect(screen.getByText("'")).toBeDefined()
    expect(screen.getByText('"')).toBeDefined()
  })

  it('formats initial value correctly', () => {
    const onChange = vi.fn()
    render(
      <DMSInput
        type="lat"
        value={12.345}
        seconds={false}
        minutesDecimals={2}
        locale={locale}
        onChange={onChange}
      />
    )
    const inputs = screen.getAllByRole('textbox')

    expect(inputs[0]).toHaveValue('12')
    expect(inputs[1]).toHaveValue('20.70')
    const signSelect = screen.getByRole('combobox')
    expect(signSelect).toHaveValue('N')
  })

  it('calls onChange with combined value when degrees input is changed', () => {
    const onChange = vi.fn()
    render(
      <DMSInput
        type="lat"
        value={12.345}
        seconds={false}
        minutesDecimals={1}
        locale={locale}
        onChange={onChange}
      />
    )
    const inputs = screen.getAllByRole('textbox')

    fireEvent.change(inputs[0], { target: { value: '13' } })
    fireEvent.blur(inputs[0])

    expect(onChange).toHaveBeenCalled()
    const lastCallValue = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCallValue).toBeCloseTo(13.345, 2)
  })

  it('updates input values when prop value changes', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <DMSInput
        type="lat"
        value={12.345}
        seconds={false}
        minutesDecimals={1}
        locale={locale}
        onChange={onChange}
      />
    )
    const inputs = screen.getAllByRole('textbox')

    expect(inputs[0]).toHaveValue('12')
    expect(inputs[1]).toHaveValue('20.7')

    rerender(
      <DMSInput
        type="lat"
        value={45.0}
        seconds={false}
        minutesDecimals={1}
        locale={locale}
        onChange={onChange}
      />
    )

    expect(inputs[0]).toHaveValue('45')
    expect(inputs[1]).toHaveValue('00.0')
  })
})
