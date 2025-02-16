import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { SignInput } from '../SignInput'

describe('SignInput', () => {
  const nsOptions = ['N', 'S'] as ['N', 'S']
  const ewOptions = ['E', 'W'] as ['E', 'W']
  const mockSetValue = vi.fn()
  const mockNextFocus = { focus: vi.fn() } as unknown as HTMLInputElement
  const mockRef = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders NS options correctly', () => {
    render(
      <SignInput
        options={nsOptions}
        value="N"
        setValue={mockSetValue}
        ref={mockRef}
      />
    )

    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getByRole('option', { name: 'N' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'S' })).toBeInTheDocument()
  })

  it('renders EW options correctly', () => {
    render(
      <SignInput
        options={ewOptions}
        value="E"
        setValue={mockSetValue}
        ref={mockRef}
      />
    )

    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getByRole('option', { name: 'E' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'W' })).toBeInTheDocument()
  })

  it('displays the initial value correctly', () => {
    render(
      <SignInput
        options={nsOptions}
        value="S"
        setValue={mockSetValue}
        ref={mockRef}
      />
    )

    expect(screen.getByRole('combobox')).toHaveValue('S')
  })

  it('calls setValue and onChange when selection changes', async () => {
    render(
      <SignInput
        options={ewOptions}
        value="E"
        setValue={mockSetValue}
        ref={mockRef}
      />
    )

    await userEvent.selectOptions(screen.getByRole('combobox'), 'W')

    expect(mockSetValue).toHaveBeenCalledWith('W')
  })

  it('focuses next element when provided', async () => {
    render(
      <SignInput
        options={nsOptions}
        value="N"
        setValue={mockSetValue}
        nextFocus={mockNextFocus}
        ref={mockRef}
      />
    )

    await userEvent.selectOptions(screen.getByRole('combobox'), 'S')
    expect(mockNextFocus.focus).toHaveBeenCalledOnce()
  })

  it('forwards ref to select element', () => {
    const testRef = vi.fn()

    render(
      <SignInput
        options={ewOptions}
        value="E"
        setValue={mockSetValue}
        ref={testRef}
      />
    )

    const select = screen.getByRole('combobox')
    expect(testRef).toHaveBeenCalledWith(select)
  })

  it('handles additional select attributes', () => {
    render(
      <SignInput
        options={nsOptions}
        value="N"
        setValue={mockSetValue}
        disabled
        className="custom-class"
        ref={mockRef}
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
    expect(select).toHaveClass('custom-class')
  })

  it('updates value when prop changes', async () => {
    const { rerender } = render(
      <SignInput
        options={nsOptions}
        value="N"
        setValue={mockSetValue}
        ref={mockRef}
      />
    )

    expect(screen.getByRole('combobox')).toHaveValue('N')

    rerender(
      <SignInput
        options={nsOptions}
        value="S"
        setValue={mockSetValue}
        ref={mockRef}
      />
    )

    expect(screen.getByRole('combobox')).toHaveValue('S')
  })
})
