# React DMS input

## General

React component for Degrees, Minutes and Seconds (DMS) coordinates input. Mainly focussed on the maritime industry.

## Installation

```sh
yarn add react-dms-input
npm install react-dms-input --save
```

## Demo

[https://phalkone.github.io/react-dms-input/](https://phalkone.github.io/react-dms-input/)

## Basic usage

```javascript
import React, { useState } from 'react'
import DMSInput from 'react-dms-input'

function App() {
  const [num, setNum] = useState(0)

  return (
    <DMSInput
      type="lat" // Required property
      value={num}
      locale={'en-US'}
      minutesDecimals={1}
      onChange={setNum}
    />
  )
}
```

## Properties

| Property        | Type                                  | Default     | Description                                                          |
| --------------- | ------------------------------------- | ----------- | -------------------------------------------------------------------- |
| type            | 'lat' \| 'long'                       |             | Latitude or longitude input.                                         |
| seconds         | boolean                               | false       | Display seconds input.                                               |
| minutesDecimals | [0-3]                                 | 1           | Fraction digits of minutes input. Ignored if seconds is true.        |
| locale          | string                                | host locale | Locale of input. Affects the decimal separator of the minutes.       |
| value           | number                                |             | Value in degrees.                                                    |
| onnChange       | (val: number \| undefined) => void    |             | Called when the degrees value changes.                               |
| nextFocus       | HTMLInputElement \| HTMLSelectElement |             | UI element to focus on once the sign once the sign has been entered. |
| ref             | React.RefObject                       |             | Reference to the input component                                     |

## License

MIT
