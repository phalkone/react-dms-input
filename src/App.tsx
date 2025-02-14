import './App.css'
import { DMSInput } from '../lib/main'
import { useEffect, useState } from 'react'

function App() {
  const [type, setType] = useState<'lat' | 'long'>('lat')
  const [seconds, setSeconds] = useState(false)
  const [value, setValue] = useState<number | undefined>(undefined)
  const [decimals, setDecimals] = useState<0 | 1 | 2 | 3>(1)
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    console.log(value)
    if (value != undefined && !isNaN(value)) {
      setInputValue(String(value))
    } else {
      setInputValue('')
    }
  }, [value])

  const handleInputConfirm = () => {
    const num = Number(inputValue)
    if (!isNaN(num)) {
      setValue(num)
    } else {
      setInputValue(String(value))
    }
  }

  return (
    <div className="container">
      <div className="left">
        <div>
          <label htmlFor="value">Value</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputConfirm()}
          />
          <span className="helper">Press enter to commit the value</span>
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'lat' | 'long')}
          >
            <option value="lat">Latitude</option>
            <option value="long">Longitude</option>
          </select>
        </div>
        <div className="checkbox-container">
          <input
            id="seconds"
            type="checkbox"
            name="seconds"
            checked={seconds}
            onChange={(e) => setSeconds(e.target.checked)}
          />
          <label htmlFor="seconds">Seconds</label>
        </div>
        {!seconds && (
          <div>
            <label htmlFor="decimals">Decimals of minutes</label>
            <select
              id="decimals"
              name="decimals"
              value={decimals}
              onChange={(e) =>
                setDecimals(Number(e.target.value) as 0 | 1 | 2 | 3)
              }
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        )}
      </div>
      <div className="right">
        <DMSInput
          type={type}
          value={value}
          seconds={seconds}
          minutesDecimals={decimals}
          onChange={setValue}
        />
      </div>
    </div>
  )
}

export default App
