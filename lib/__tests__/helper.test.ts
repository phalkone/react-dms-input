import {
  getDegreesMinutesSeconds,
  getMaxMinutes,
  formatNumber
} from '../helper'

describe('helper', () => {
  it('should convert degrees to DMS', () => {
    expect(getDegreesMinutesSeconds(10, 0, false)).toEqual([10, 0, 0])
    expect(getDegreesMinutesSeconds(10.5, 0, false)).toEqual([10, 30, 0])
    expect(getDegreesMinutesSeconds(10.6, 2, false)).toEqual([10, 36, 0])
    expect(getDegreesMinutesSeconds(10.36, 2, false)).toEqual([10, 21.6, 0])
    expect(getDegreesMinutesSeconds(10.36, 2, true)).toEqual([10, 21, 36])
    expect(getDegreesMinutesSeconds(10.333333, 2, false)).toEqual([10, 20, 0])
    expect(getDegreesMinutesSeconds(10.387653, 0, true)).toEqual([10, 23, 16])
    expect(getDegreesMinutesSeconds(10.387653, 2, false)).toEqual([
      10, 23.26, 0
    ])
    expect(getDegreesMinutesSeconds(10.387653, 1, false)).toEqual([10, 23.3, 0])
    expect(getDegreesMinutesSeconds(10.387653, 3, false)).toEqual([
      10, 23.259, 0
    ])
    expect(getDegreesMinutesSeconds(10.387653, 2, true)).toEqual([10, 23, 16])
    expect(getDegreesMinutesSeconds(-10.387653, 2, true)).toEqual([10, 23, 16])
    expect(getDegreesMinutesSeconds(-190.387653, 2, true)).toEqual([
      190, 23, 16
    ])
  })

  it('should get the maximum minutes depending on decimals', () => {
    expect(getMaxMinutes(0)).toEqual(59)
    expect(getMaxMinutes(1)).toEqual(59.9)
    expect(getMaxMinutes(2)).toEqual(59.99)
    expect(getMaxMinutes(3)).toEqual(59.999)
  })

  it('should format a number correctly', () => {
    expect(formatNumber('0', 2, 0)).toEqual('00')
    expect(formatNumber('0', 3, 0)).toEqual('000')
    expect(formatNumber('0', 3, 1)).toEqual('000.0')
    expect(formatNumber('0', 3, 2)).toEqual('000.00')
    expect(formatNumber('0', 3, 3)).toEqual('000.000')
    expect(formatNumber('0', 1, 4)).toEqual('0.0000')

    expect(formatNumber('180', 3, 0)).toEqual('180')
    expect(formatNumber('180', 3, 1)).toEqual('180.0')
    expect(formatNumber('180', 3, 2)).toEqual('180.00')
    expect(formatNumber('180', 3, 3)).toEqual('180.000')
    expect(formatNumber('180', 3, 4)).toEqual('180.0000')

    expect(formatNumber('90', 2, 0)).toEqual('90')
    expect(formatNumber('90', 2, 1)).toEqual('90.0')
    expect(formatNumber('90', 2, 2)).toEqual('90.00')
    expect(formatNumber('90', 2, 3)).toEqual('90.000')
    expect(formatNumber('90', 2, 4)).toEqual('90.0000')

    expect(formatNumber('90.4', 2, 0)).toEqual('90')
    expect(formatNumber('90.50', 2, 1)).toEqual('90.5')
    expect(formatNumber('90.56', 2, 1)).toEqual('90.6')
    expect(formatNumber('90.567', 2, 1)).toEqual('90.6')
    expect(formatNumber('90.567', 2, 4)).toEqual('90.5670')

    expect(() => formatNumber('90.4', 1, 0)).toThrowError(
      'Integer part too long'
    )
    expect(() => formatNumber('90.50', 1, 1)).toThrowError(
      'Integer part too long'
    )
    expect(() => formatNumber('90.56', 1, 1)).toThrowError(
      'Integer part too long'
    )
    expect(() => formatNumber('90.567', 1, 1)).toThrowError(
      'Integer part too long'
    )
    expect(() => formatNumber('90.567', 1, 4)).toThrowError(
      'Integer part too long'
    )
  })
})
