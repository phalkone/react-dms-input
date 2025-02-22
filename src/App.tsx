import './App.css'
import { DMSInput } from '../lib/main'
import { useEffect, useState } from 'react'

function App() {
  const [mode, setMode] = useState<'D' | 'DM' | 'DMS'>('DM')
  const [type, setType] = useState<'lat' | 'long'>('lat')
  const [value, setValue] = useState<number | undefined>(undefined)
  const [locale, setLocale] = useState<string | undefined>('en-US')
  const [decimals, setDecimals] = useState<0 | 1 | 2 | 3 | 4>(1)
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
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
          <label htmlFor="mode">Mode</label>
          <select
            id="mode"
            name="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'D' | 'DM' | 'DMS')}
          >
            <option value="D">Degrees (D)</option>
            <option value="DM">Degrees-Minutes (DM)</option>
            <option value="DMS">Degrees-Minutes-Seconds (DMS)</option>
          </select>
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
        <div>
          <label htmlFor="locale">Locale</label>
          <select
            id="locale"
            name="locale"
            value={locale}
            onChange={(e) =>
              setLocale(
                e.target.value === 'default' ? undefined : e.target.value
              )
            }
          >
            <option value="default">default</option>
            <option value="en-US">en-US</option>
            <option value="nl-BE">nl-BE</option>
          </select>
        </div>
        <div>
          <label htmlFor="decimals">Fraction Digits</label>
          <select
            id="decimals"
            name="decimals"
            value={decimals}
            onChange={(e) =>
              setDecimals(Number(e.target.value) as 0 | 1 | 2 | 3 | 4)
            }
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>
      <div className="right">
        <DMSInput
          mode={mode}
          type={type}
          value={value}
          locale={locale}
          fractionDigits={decimals}
          onChange={setValue}
        />
      </div>
    </div>
  )
}

export default App
