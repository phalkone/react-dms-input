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

export const escapeForRegex = (char: string) => {
  const specialChars = [
    '.',
    '^',
    '$',
    '*',
    '+',
    '?',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '|',
    '\\'
  ]
  return specialChars.includes(char) ? `\\${char}` : char
}

export const sanitizeNumber = (str: string) => {
  const match = str.match(/(\d+).?(\d+)?/)
  if (!match) return 0
  return parseFloat(match[1] + '.' + (match[2] || '0'))
}

export const formatNumber = (
  str: string,
  integer: number,
  decimals: number,
  locale?: string
) => {
  const format = Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    minimumIntegerDigits: integer,
    useGrouping: false,
    numberingSystem: 'latn'
  })

  const num = sanitizeNumber(str)
  return format.format(num)
}

export const getDecimalSeparator = (locale?: string) => {
  const formatter = new Intl.NumberFormat(locale)
  const parts = formatter.formatToParts(1.1)
  const decimalPart = parts.find((part) => part.type === 'decimal')
  return decimalPart ? decimalPart.value : '.'
}
