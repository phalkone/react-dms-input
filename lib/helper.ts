export const getDegreesMinutesSeconds = (
  val: number,
  decimals: 0 | 1 | 2 | 3,
  sec: boolean
) => {
  const abs = Math.abs(val)
  const degrees = Math.trunc(abs)
  let minutes = (abs - degrees) * 60
  const seconds = sec ? Math.round((minutes - Math.trunc(minutes)) * 60) : 0
  if (sec) {
    minutes = Math.trunc(minutes)
  } else {
    minutes =
      Math.round(minutes * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  return [degrees, minutes, seconds]
}

export const getMaxMinutes = (decimals: 0 | 1 | 2 | 3) => {
  return parseFloat(`59.${'9'.repeat(decimals)}`) || 59
}

export const formatNumber = (
  str: string,
  integer: number,
  decimals: number
) => {
  const num = parseFloat(str) || 0
  const [int, decimal] = num.toFixed(decimals).split('.')
  if (String(int).length > integer) throw new Error('Integer part too long')
  return `${int.padStart(integer, '0')}${decimal ? '.' + decimal : ''}`
}
