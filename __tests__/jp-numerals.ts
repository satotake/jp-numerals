import { numerals, Numeral, NumeralZero } from '../src/jp-numerals'
import { JpNumeralUnit } from '../src/type'

describe('Numeral Class', () => {
  it('can handle integer', () => {
    const n = new Numeral(JpNumeralUnit.万, 123_4567)
    expect(n.unit).toEqual(JpNumeralUnit.万)
    expect(n.raw).toEqual(123_4567)

    expect(n.rank).toEqual(1)
    expect(n.digits).toEqual(123)
    expect(n.character).toEqual('万')

    expect(n.toString()).toEqual('123万')
    expect(n.toNumeralObj()).toEqual({
      unit: JpNumeralUnit.万,
      character: '万',
      rank: 1,
      digits: 123
    })
  })

  it('can handle float', () => {
    const n = new Numeral(JpNumeralUnit.万, 123_4567.789)
    expect(n.raw).toEqual(123_4567.789)

    expect(n.digits).toEqual(123)
    expect(n.character).toEqual('万')

    expect(n.toNumeralObj()).toEqual({
      unit: JpNumeralUnit.万,
      character: '万',
      rank: 1,
      digits: 123
    })
  })

  it('raise error if number is negative', () => {
    expect(() => new Numeral(JpNumeralUnit.零, -123_4567.789)).toThrow()
  })
})

describe('class NumeralZero', () => {
  it('exclude "零" for stringification', () => {
    const n = new NumeralZero(JpNumeralUnit.零, 123_4567)
    expect(n.toString()).toEqual('4567')
  })

  it('can display decimal number', () => {
    const n = new NumeralZero(JpNumeralUnit.零, 123_4567.89)
    expect(n.toString()).toEqual('4567.89')
  })
})

describe('jpNumerals', () => {
  it('can handle integer', () => {
    const n = numerals(12_3456_7890)
    expect(n.toTuples()).toEqual([[12, '億'], [3456, '万'], [7890, '']])

    expect(n.toNumerals()).toEqual([
      new Numeral(JpNumeralUnit.億, 12_3456_7890),
      new Numeral(JpNumeralUnit.万, 12_3456_7890),
      new Numeral(JpNumeralUnit.零, 12_3456_7890)
    ])

    expect(n.toNumeralObjs()).toEqual([
      {
        unit: JpNumeralUnit.億,
        character: '億',
        rank: 2,
        digits: 12
      },
      {
        unit: JpNumeralUnit.万,
        character: '万',
        rank: 1,
        digits: 3456
      },
      {
        unit: JpNumeralUnit.零,
        character: '',
        rank: 0,
        digits: 7890
      }
    ])

    expect(n.toString()).toEqual('12億3456万7890')
    expect(n.toNumber()).toEqual(1234567890)
  })

  it('can handle float', () => {
    const n = numerals(12_3456_7890.123)
    expect(n.toTuples()).toEqual([[12, '億'], [3456, '万'], [7890.123, '']])
  })

  it('throw error if number is negative', () => {
    expect(() => numerals(-12_3456_7890.123)).toThrow()
  })

  it('can use base as option', () => {
    const n_base = numerals(12_3456, JpNumeralUnit.万)
    const n = numerals(12_3456_0000)

    expect(n_base.toTuples()).toEqual(n.toTuples())
    expect(n_base.toNumerals()).toEqual(n.toNumerals())
    expect(n_base.toNumeralObjs()).toEqual(n.toNumeralObjs())

    expect(n_base.toString()).toEqual(n.toString())
    expect(n_base.toNumber()).toEqual(1234560000)
  })
})
