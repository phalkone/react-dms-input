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
import { DMSInputProps } from './types'

const DMSInput = forwardRef(function DMSInput(
  {
    type,
    value,
    seconds = false,
    minutesDecimals = 1,
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
        ? getDegreesMinutesSeconds(value, minutesDecimals, seconds)
        : [0, 0, 0],
    [value, minutesDecimals, seconds]
  )
  const [coordinateDegrees, setCoordinateDegrees] = useState<string>(
    value
      ? formatNumber(degrees.toString(), type === 'lat' ? 2 : 3, 0, locale)
      : ''
  )
  const [coordinateMinutes, setCoordinateMinutes] = useState<string>(
    value
      ? formatNumber(
          minutes.toString(),
          2,
          seconds ? 0 : minutesDecimals,
          locale
        )
      : ''
  )
  const [coordinateSeconds, setCoordinateSeconds] = useState<string>(
    seconds && value ? formatNumber(sec.toString(), 2, 0, locale) : ''
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
      coordinateMinutes === '' &&
      ((seconds && coordinateSeconds === '') || !seconds)
    ) {
      if (onChange) onChange(undefined)
    } else {
      const sign = coordinateSign === 'S' || coordinateSign === 'W' ? -1 : 1
      const newValue =
        sign *
        (sanitizeNumber(coordinateDegrees) +
          sanitizeNumber(coordinateMinutes) / 60 +
          sanitizeNumber(coordinateSeconds) / 3600)

      if (onChange) onChange(newValue)
    }
  }, [
    coordinateDegrees,
    coordinateMinutes,
    coordinateSeconds,
    coordinateSign,
    onChange,
    seconds,
    separator
  ])

  useEffect(() => {
    const activeEl = document.activeElement
    const isEditing =
      activeEl === degreesRef.current ||
      activeEl === minutesRef.current ||
      (seconds && activeEl === secondsRef.current)

    if (isEditing) return
    if (value !== undefined) {
      const [deg, min, sec] = getDegreesMinutesSeconds(
        value,
        minutesDecimals,
        seconds
      )
      setCoordinateDegrees(
        formatNumber(deg.toString(), type === 'lat' ? 2 : 3, 0, locale)
      )
      setCoordinateMinutes(
        formatNumber(min.toString(), 2, seconds ? 0 : minutesDecimals, locale)
      )
      setCoordinateSeconds(formatNumber(sec.toString(), 2, 0, locale))
      setCoordinateSign(
        value < 0 ? (type === 'lat' ? 'S' : 'W') : type === 'lat' ? 'N' : 'E'
      )
    }
  }, [value, type, minutesDecimals, seconds, locale])

  return (
    <div className="DMSInput">
      <div className="input-wrapper degrees-wrapper">
        <NumberInput
          max={type === 'lat' ? 90 : 180}
          decimals={0}
          value={coordinateDegrees}
          setValue={setCoordinateDegrees}
          ref={ref || degreesRef}
          nextFocus={minutesRef.current}
        />
        <span>°</span>
      </div>
      <div className="input-wrapper minutes-wrapper">
        <NumberInput
          value={coordinateMinutes}
          max={seconds ? 59 : getMaxMinutes(minutesDecimals)}
          decimals={seconds ? 0 : minutesDecimals}
          setValue={setCoordinateMinutes}
          locale={locale}
          nextFocus={seconds ? secondsRef.current : signRef.current}
          previousFocus={
            ref && typeof ref === 'object' && 'current' in ref
              ? ref.current
              : degreesRef.current
          }
          ref={minutesRef}
        />
        <span>'</span>
      </div>
      {seconds && (
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
      <SignInput
        ref={signRef}
        value={coordinateSign}
        options={type === 'lat' ? ['N', 'S'] : ['E', 'W']}
        setValue={setCoordinateSign}
        nextFocus={nextFocus}
      />
    </div>
  )
})

export default DMSInput
