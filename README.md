# React DMS input

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
import 'react-dms-input/style.css'

function App() {
  const [value, setValue] = useState(0)

  return (
    <DMSInput
      mode="DMS"
      type="lat" // Required property
      value={value}
      locale={'en-US'}
      fractionDigits={1}
      onChange={setValue}
    />
  )
}
```

## Properties

| Property       | Type                                  | Default       | Description                                                                          |
| -------------- | ------------------------------------- | ------------- | ------------------------------------------------------------------------------------ |
| mode           | 'DMS' \| 'DM' \| 'D'                  | 'DM'          | Display mode of input.                                                               |
| type           | 'lat' \| 'long'                       |               | Latitude or longitude input.                                                         |
| fractionDigits | [0-4]                                 | 1             | Fraction digits of degrees (D mode) or minutes (DM mode) input. Ignored in DMS mode. |
| locale         | string                                | (host locale) | Locale of input. Affects the decimal separator of the minutes.                       |
| value          | number                                |               | Value in degrees.                                                                    |
| onnChange      | (val: number \| undefined) => void    |               | Called when the degrees value changes.                                               |
| nextFocus      | HTMLInputElement \| HTMLSelectElement |               | UI element to focus on once the sign once the sign has been entered.                 |
| ref            | React.RefObject                       |               | Reference to the input component                                                     |
| classes        | DMSInputClasses                       |               | Custom css classes for all containers                                                |
| style          | React.CSSProperties                   |               | Inline styles for the root container                                                 |

## Styling Reference

### CSS Class Hierarchy

```bash
.DMSInput (root container)
├── .input-wrapper (generic input group)
│   ├── input (number input element)
│   └── span (degree symbol)
├── .degrees-wrapper (specific to degrees)
├── .minutes-wrapper (specific to minutes)
├── .seconds-wrapper (specific to seconds)
└── .sign-input (container for N/S/E/W selector)
    └── select (sign dropdown element)
```

### DMSInputClasses

| Class Name         | Location                     | Contains                                |
| ------------------ | ---------------------------- | --------------------------------------- |
| **root**           | Root container               | All coordinate inputs and sign selector |
| **inputWrapper**   | Input group container        | Input field + measurement symbol        |
| **degreesWrapper** | Degrees-specific container   | Degrees input + ° symbol                |
| **minutesWrapper** | Minutes-specific container   | Minutes input + ' symbol                |
| **secondsWrapper** | Seconds-specific container   | Seconds input + " symbol                |
| **signInput**      | Cardinal direction container | N/S/E/W dropdown selector               |

## License

MIT
