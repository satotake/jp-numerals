import { Numeral } from './jp-numerals'

export enum JpNumeralUnit {
  零,

  万,
  億,
  兆,
  京,
  垓,
  秭,
  穣,
  溝,
  澗,
  正,
  載,
  極,
  恒河沙,
  阿僧祇,
  那由他,
  不可思議,
  無量大数
}

export interface NumeralObj {
  unit: JpNumeralUnit
  character: string
  rank: number
  digits: number
}

export interface Numerals {
  toNumerals: () => Numeral[]
  toTuples: () => [number, string][]
  toNumeralObjs: () => NumeralObj[]
  toString: () => string
  toAbsNumber: () => number

  sign: () => Sign
  toSignedNumerals: () => [Sign, Numeral[]]
  toSignedTuples: () => [Sign, [number, string][]]
  toSignedNumeralObjs: () => [Sign, NumeralObj[]]
  toSignedString: () => string
  toNumber: () => number
}

export type Sign = -1 | 1
