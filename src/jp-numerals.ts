import { JpNumeralUnit, NumeralObj, Numerals, Sign } from './type'
export { JpNumeralUnit, NumeralObj, Numerals, Sign }

const EPSILON = 1e-10
const log10 = (v: number) => Math.log(v) / Math.log(10)
// for IE

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
    return this.digits === 0 ? '' : `${this.digits}${this.character}`
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
  const sign = n < 0 ? -1 : 1
  const abs = Math.abs(n) * Math.pow(10, base * 4)
  // in myriads

  const unitLen = Object.keys(JpNumeralUnit).length / 2 // maximum unit
  const numberLen = Math.ceil(log10(abs) / 4 + EPSILON)
  const len = Math.min(unitLen, numberLen)
  const nums = new Array(Math.max(1, len))
    .fill(NaN)
    .map((_, i) => (i === 0 ? new NumeralZero(i, abs) : new Numeral(i, abs)))
    .reverse()

  return {
    toNumerals: () => nums,
    toTuples: () => nums.map(numeral => numeral.toTuple()),
    toNumeralObjs: () => nums.map(numeral => numeral.toNumeralObj()),
    toString: () => nums.reduce((s, numeral) => `${s}${numeral}`, ''),
    toAbsNumber: () => abs,

    sign: () => sign,
    toSignedNumerals: () => [sign, nums],
    toSignedTuples: () => [sign, nums.map(numeral => numeral.toTuple())],
    toSignedNumeralObjs: () => [sign, nums.map(numeral => numeral.toNumeralObj())],
    toSignedString: () => nums.reduce((s, numeral) => `${s}${numeral}`, sign === -1 ? '-' : ''),
    toNumber: () => sign * abs,

    round: (base: JpNumeralUnit) => numerals(sign * Math.round(abs / Math.pow(10, base * 4)), base)
  }
}

export default numerals
