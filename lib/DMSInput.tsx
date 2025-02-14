import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { SignInput } from './SignInput'
import { NumberInput } from './NumberInput'
import './DMSInput.css'
import { getDegreesMinutesSeconds, getMaxMinutes } from './helper'
import { DMSInputProps } from './types'

const DMSInput = forwardRef(function DMSInput(
  {
    type,
    value,
    seconds = false,
    minutesDecimals = 1,
    onChange,
    nextFocus
  }: DMSInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [degrees, minutes, sec] = value
    ? getDegreesMinutesSeconds(value, minutesDecimals, seconds)
    : [0, 0, 0]
  const [coordinateDegrees, setCoordinateDegrees] = useState<string>(
    value ? degrees.toString() : ''
  )
  const [coordinateMinutes, setCoordinateMinutes] = useState<string>(
    value ? minutes.toString() : ''
  )
  const [coordinateSeconds, setCoordinateSeconds] = useState<string>(
    seconds && value ? sec.toString() : ''
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

  const coordinatesDegreesRef = useRef<HTMLInputElement>(null)
  const coordinateMinutesRef = useRef<HTMLInputElement>(null)
  const coordinateSecondsRef = useRef<HTMLInputElement>(null)
  const coordinateSignRef = useRef<HTMLSelectElement>(null)

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
        (Number(coordinateDegrees) +
          Number(coordinateMinutes) / 60 +
          Number(coordinateSeconds) / 3600)

      if (onChange) onChange(newValue)
    }
  }, [
    coordinateDegrees,
    coordinateMinutes,
    coordinateSeconds,
    coordinateSign,
    onChange,
    seconds
  ])

  useEffect(() => {
    if (value !== undefined) {
      const [deg, min, sec] = getDegreesMinutesSeconds(
        value,
        minutesDecimals,
        seconds
      )
      setCoordinateDegrees(deg.toString())
      setCoordinateMinutes(min.toString())
      setCoordinateSeconds(sec.toString())
      setCoordinateSign(
        value < 0 ? (type === 'lat' ? 'S' : 'W') : type === 'lat' ? 'N' : 'E'
      )
    }
  }, [value, type, minutesDecimals, seconds])

  return (
    <div className="DMSInput">
      <div className="input-wrapper degrees-wrapper">
        <NumberInput
          max={type === 'lat' ? 90 : 180}
          decimals={0}
          value={coordinateDegrees}
          setValue={setCoordinateDegrees}
          ref={ref ? ref : coordinatesDegreesRef}
          nextFocus={coordinateMinutesRef.current}
        />
        <span>°</span>
      </div>
      <div className="input-wrapper minutes-wrapper">
        <NumberInput
          value={coordinateMinutes}
          max={seconds ? 59 : getMaxMinutes(minutesDecimals)}
          decimals={seconds ? 0 : minutesDecimals}
          setValue={setCoordinateMinutes}
          nextFocus={
            seconds ? coordinateSecondsRef.current : coordinateSignRef.current
          }
          previousFocus={
            ref !== null && typeof ref === 'object' && 'current' in ref
              ? ref.current
              : coordinatesDegreesRef.current
          }
          ref={coordinateMinutesRef}
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
            nextFocus={coordinateSignRef.current}
            ref={coordinateSecondsRef}
          />
          <span>"</span>
        </div>
      )}
      <SignInput
        ref={coordinateSignRef}
        value={coordinateSign}
        options={type === 'lat' ? ['N', 'S'] : ['E', 'W']}
        setValue={setCoordinateSign}
        nextFocus={nextFocus}
      />
    </div>
  )
})

export default DMSInput
