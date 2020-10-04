import { JpNumeralUnit, NumeralObj, Numerals } from './type'
export { JpNumeralUnit, NumeralObj, Numerals }

const log10 = (v: number) => Math.log(v) / Math.log(10)

export class Numeral {
  raw: number
  unit: JpNumeralUnit
  constructor(unit: JpNumeralUnit, raw: number) {
    if (raw < 0) {
      throw Error('Number must be positive or 0')
    }

    this.raw = raw
    this.unit = unit
  }

  get character(): string {
    return JpNumeralUnit[this.unit]
  }

  get rank(): number {
    return this.unit
  }

  get digits(): number {
    return Math.floor(this.raw / Math.pow(10, this.rank * 4)) % Math.pow(10, 4)
  }

  toTuple(): [number, string] {
    const { character, digits } = this
    return [digits, character]
  }
  toString(): string {
    return `${this.digits}${this.character}`
  }
  toNumeralObj(): NumeralObj {
    const { unit, character, rank, digits } = this
    return { unit, character, rank, digits }
  }
}

export class NumeralZero extends Numeral {
  get character(): string {
    return ''
  }

  get digits(): number {
    const factor = 10 ** this.scale
    const val = (this.raw / Math.pow(10, this.rank * 4)) % Math.pow(10, 4)
    return Math.round(val * factor) / factor
  }

  // TODO handling decimal points
  private get scale(): number {
    const s = this.raw.toString()
    return s.includes('.') ? s.split('.')[1].length : 0
  }
}

export const numerals = (n: number, base: JpNumeralUnit = JpNumeralUnit.零): Numerals => {
  // TODO(handle negative)
  if (n < 0) {
    throw Error('number must be string')
  }

  const raw = Math.abs(n) * Math.pow(10, base * 4)
  // in myriads

  const unitLen = Object.keys(JpNumeralUnit).length / 2
  const numberLen = Math.ceil(log10(raw) / 4)
  const len = Math.min(unitLen, numberLen)
  const numerals = new Array(len)
    .fill(NaN)
    .map((_, i) => (i === 0 ? new NumeralZero(i, raw) : new Numeral(i, raw)))
    .reverse()

  return {
    toNumerals: () => numerals,
    toTuples: () => numerals.map(numeral => numeral.toTuple()),
    toNumeralObjs: () => numerals.map(numeral => numeral.toNumeralObj()),
    toString: () => numerals.reduce((s, numeral) => `${s}${numeral}`, ''),
    toNumber: () => raw
  }
}

export default numerals
