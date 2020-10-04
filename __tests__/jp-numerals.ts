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

    const n2 = numerals(1_0000_0000)
    expect(n2.toString()).toEqual('1億')
  })

  it('can handle float', () => {
    const n = numerals(12_3456_7890.123)
    expect(n.toTuples()).toEqual([[12, '億'], [3456, '万'], [7890.123, '']])
  })

  it('can handle negative integer', () => {
    const n = numerals(-12_3456_789_0)

    expect(n.sign()).toEqual(-1)

    expect(n.toAbsNumber()).toEqual(12_3456_789_0)
    expect(n.toNumber()).toEqual(-12_3456_789_0)
    expect(n.toSignedString()).toEqual('-12億3456万7890')
    expect(n.toSignedTuples()).toEqual([-1, [[12, '億'], [3456, '万'], [7890, '']]])
    expect(n.toSignedNumerals()).toEqual([-1, [
      new Numeral(JpNumeralUnit.億, 12_3456_7890),
      new Numeral(JpNumeralUnit.万, 12_3456_7890),
      new Numeral(JpNumeralUnit.零, 12_3456_7890)
    ]])
    expect(n.toSignedNumeralObjs()).toEqual([-1, [
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
    ]])
  })

  it('can use base as option', () => {
    const nBase = numerals(12_3456, JpNumeralUnit.万)
    const n = numerals(12_3456_0000)

    expect(nBase.toTuples()).toEqual(n.toTuples())
    expect(nBase.toNumerals()).toEqual(n.toNumerals())
    expect(nBase.toNumeralObjs()).toEqual(n.toNumeralObjs())

    expect(nBase.toString()).toEqual(n.toString())
    expect(nBase.toNumber()).toEqual(1234560000)
  })
})
