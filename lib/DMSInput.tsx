import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { SignInput } from './SignInput'
import { NumberInput } from './NumberInput'
import './DMSInput.css'
import {
  formatNumber,
  getDecimalSeparator,
  getDegreesMinutesSeconds,
  getMaxMinutes,
  sanitizeNumber
} from './helper'

export interface DMSInputProps {
  mode?: 'DMS' | 'DM' | 'D'
  type: 'lat' | 'long'
  fractionDigits?: 0 | 1 | 2 | 3 | 4
  locale?: string
  value?: number
  onChange?: (val: number | undefined) => void
  nextFocus?: HTMLInputElement | HTMLSelectElement | null
}

const DMSInput = forwardRef(function DMSInput(
  {
    mode = 'DM',
    type,
    value,
    fractionDigits = 1,
    locale,
    onChange,
    nextFocus
  }: DMSInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const separator = useMemo(() => getDecimalSeparator(locale), [locale])
  const [degrees, minutes, sec] = useMemo(
    () =>
      value !== undefined
        ? mode === 'D'
          ? [Math.abs(value), 0, 0]
          : getDegreesMinutesSeconds(value, fractionDigits, mode === 'DMS')
        : [0, 0, 0],
    [value, fractionDigits, mode]
  )
  const [coordinateDegrees, setCoordinateDegrees] = useState<string>(
    value !== undefined
      ? formatNumber(
          degrees.toString(),
          type === 'lat' ? 2 : 3,
          mode === 'D' ? fractionDigits : 0,
          locale
        )
      : ''
  )
  const [coordinateMinutes, setCoordinateMinutes] = useState<string>(
    mode !== 'D' && value !== undefined
      ? formatNumber(
          minutes.toString(),
          2,
          mode === 'DM' ? fractionDigits : 0,
          locale
        )
      : ''
  )
  const [coordinateSeconds, setCoordinateSeconds] = useState<string>(
    mode === 'DMS' && value !== undefined
      ? formatNumber(sec.toString(), 2, 0, locale)
      : ''
  )
  const [coordinateSign, setCoordinateSign] = useState<string>(
    value && value < 0
      ? type === 'lat'
        ? 'S'
        : 'W'
      : type === 'lat'
        ? 'N'
        : 'E'
  )

  const degreesRef = useRef<HTMLInputElement>(null)
  const minutesRef = useRef<HTMLInputElement>(null)
  const secondsRef = useRef<HTMLInputElement>(null)
  const signRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (
      coordinateDegrees === '' &&
      ((mode !== 'D' && coordinateMinutes === '') || mode === 'D') &&
      ((mode === 'DMS' && coordinateSeconds === '') || mode !== 'DMS')
    ) {
      onChange?.(undefined)
    } else {
      const sign = coordinateSign === 'S' || coordinateSign === 'W' ? -1 : 1
      let newValue =
        sign *
        (sanitizeNumber(coordinateDegrees) +
          sanitizeNumber(coordinateMinutes) / 60 +
          sanitizeNumber(coordinateSeconds) / 3600)

      const maxAllowed = type === 'lat' ? 90 : 180

      if (Math.abs(newValue) > maxAllowed) {
        newValue = sign * maxAllowed
        setCoordinateDegrees(
          formatNumber(
            Math.abs(newValue).toString(),
            type === 'lat' ? 2 : 3,
            mode === 'D' ? fractionDigits : 0
          )
        )
        if (mode !== 'D')
          setCoordinateMinutes(
            formatNumber('0', 2, mode === 'DM' ? fractionDigits : 0)
          )
        if (mode === 'DMS') setCoordinateSeconds(formatNumber('0', 2, 0))
      }

      onChange?.(newValue)
    }
  }, [
    coordinateDegrees,
    coordinateMinutes,
    coordinateSeconds,
    coordinateSign,
    fractionDigits,
    onChange,
    mode,
    separator,
    type
  ])

  useEffect(() => {
    const activeEl = document.activeElement
    const isEditing =
      activeEl === degreesRef.current ||
      (mode !== 'D' && activeEl === minutesRef.current) ||
      (mode === 'DMS' && activeEl === secondsRef.current)

    if (isEditing) return
    if (value !== undefined) {
      const [deg, min, sec] =
        mode === 'D'
          ? [Math.abs(value), 0, 0]
          : getDegreesMinutesSeconds(value, fractionDigits, mode === 'DMS')
      setCoordinateDegrees(
        formatNumber(
          deg.toString(),
          type === 'lat' ? 2 : 3,
          mode === 'D' ? fractionDigits : 0,
          locale
        )
      )
      setCoordinateMinutes(
        formatNumber(
          min.toString(),
          2,
          mode === 'DM' ? fractionDigits : 0,
          locale
        )
      )
      setCoordinateSeconds(formatNumber(sec.toString(), 2, 0, locale))
      setCoordinateSign(
        value < 0 ? (type === 'lat' ? 'S' : 'W') : type === 'lat' ? 'N' : 'E'
      )
    }
  }, [value, type, fractionDigits, mode, locale])

  return (
    <div className="DMSInput">
      <div className="input-wrapper degrees-wrapper">
        <NumberInput
          max={type === 'lat' ? 90 : 180}
          decimals={mode === 'D' ? fractionDigits : 0}
          value={coordinateDegrees}
          setValue={setCoordinateDegrees}
          locale={locale}
          ref={ref || degreesRef}
          nextFocus={mode !== 'D' ? minutesRef.current : undefined}
        />
        <span>°</span>
      </div>
      {mode !== 'D' && (
        <div className="input-wrapper minutes-wrapper">
          <NumberInput
            value={coordinateMinutes}
            max={mode === 'DMS' ? 59 : getMaxMinutes(fractionDigits)}
            decimals={mode === 'DM' ? fractionDigits : 0}
            setValue={setCoordinateMinutes}
            locale={locale}
            nextFocus={mode === 'DMS' ? secondsRef.current : signRef.current}
            previousFocus={
              ref && typeof ref === 'object' && 'current' in ref
                ? ref.current
                : degreesRef.current
            }
            ref={minutesRef}
          />
          <span>'</span>
        </div>
      )}
      {mode === 'DMS' && (
        <div className="input-wrapper seconds-wrapper">
          <NumberInput
            value={coordinateSeconds}
            max={59}
            decimals={0}
            setValue={setCoordinateSeconds}
            locale={locale}
            nextFocus={signRef.current}
            ref={secondsRef}
          />
          <span>"</span>
        </div>
      )}
      <div className="sign-input">
        <SignInput
          ref={signRef}
          value={coordinateSign}
          options={type === 'lat' ? ['N', 'S'] : ['E', 'W']}
          setValue={setCoordinateSign}
          nextFocus={nextFocus}
        />
      </div>
    </div>
  )
})

export default DMSInput
