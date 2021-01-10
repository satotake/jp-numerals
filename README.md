# jp-numerals
Convert numbers into Japanese rank format
(e.g. 123455 => 12_万_3455)

inspired from [number-to-chinise-words](https://github.com/digi3studio/number-to-chinese-words)

## Instaling

```shell
npm install jp-numerals
```

Or,

```shell
yarn add jp-numerals
```


### Usage

#### numerals(n: number, base: JpNumeralUnit = JpNumeralUnit.零) => Numerals

```ts
const formatter = require('jp-numerals')
// or import { numerals } from 'jp-numerals'

const n = formatter.numerals(123456789)
```

#### Numerals.toString

```ts
n.toString()

// => returns
'1億2345万6789'
```

#### Numerals.toTuples

```ts
n.toTuples()

// => returns
[
  [1, '億'],
  [2345, '万'],
  [6789, '']
]
```

#### Numerals.toNumeralObjs

```ts
n.toNumeralObjs()

// => returns
[
  { unit: 2, character: '億', rank: 2, digits: 1 },
  { unit: 1, character: '万', rank: 1, digits: 2345 },
  { unit: 0, character: '', rank: 0, digits: 6789 } 
]
```

#### Numerals.toNumerals

```ts
n.toNumerals()

// => returns
[ 
  Numeral { raw: 123456789, unit: 2 },
  Numeral { raw: 123456789, unit: 1 },
  NumeralZero { raw: 123456789, unit: 0 } 
]
```

#### Numerals.round 
- round: : (base: JpNumeralUnit) => Numerals

```ts
import {numerals} from 'jp-numerals';
const n = numerals(12_3456_7890)

n.round(JpNumeralUnit.億).toString()
// => returns
'12億'

```

#### Signed methods

- sign: () => Sign
- toSignedNumerals: () => [Sign, Numeral[]]
- toSignedTuples: () => [Sign, [number, string][]]
- toSignedNumeralObjs: () => [Sign, NumeralObj[]]
- toSignedString: () => string

```ts
import {numerals} from 'jp-numerals';
const n = numerals(-123456789)

n.sign()
// => returns -1

n.toSignedString()
// => returns '-1億2345万6789'

n.toSignedNumeralObjs()
// => returns
[
  -1,
  [
    { unit: 2, character: '億', rank: 2, digits: 1 },
    { unit: 1, character: '万', rank: 1, digits: 2345 },
    { unit: 0, character: '', rank: 0, digits: 6789 } 
  ]
]
```


## Development

### test

``` shell
npm test
npm run test:watch
npm run test:prod
```

### commit

Do not use regular `git commit` for semantic release.

Instead:

``` shell
npm run commit
```

---



This library is based on [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter/)
