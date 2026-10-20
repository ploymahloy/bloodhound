import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { fetchCitySuggestions, MIN_CITY_SUGGEST_LENGTH } from '../lib/placeSuggest'
import { Input, type InputProps } from './Input'
import './CityInput.css'

const DEBOUNCE_MS = 250

export interface CityInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'ref'> {
  value: string
  /** Called with the new value on typing and when a suggestion is chosen. */
  onValueChange: (value: string) => void
}

export const CityInput = ({
  value,
  onValueChange,
  className,
  onFocus,
  onBlur,
  onKeyDown,
  id,
  ...props
}: CityInputProps) => {
  const listboxId = useId()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const focusedRef = useRef(false)
  // Value just chosen from the list; avoids re-fetching suggestions for it.
  const skipValueRef = useRef<string | null>(null)

  const trimmed = value.trim()
  const showList =
    open && suggestions.length > 0 && trimmed.length >= MIN_CITY_SUGGEST_LENGTH

  useEffect(() => {
    if (
      !focusedRef.current ||
      value === skipValueRef.current ||
      trimmed.length < MIN_CITY_SUGGEST_LENGTH
    ) {
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const items = await fetchCitySuggestions(trimmed, controller.signal)
        if (controller.signal.aborted) return
        setSuggestions(items)
        setActiveIndex(-1)
        setOpen(items.length > 0)
      } catch {
        if (controller.signal.aborted) return
        // Suggestions are best-effort; fall back to a plain text field.
        setSuggestions([])
        setOpen(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [value, trimmed])

  const select = (suggestion: string) => {
    skipValueRef.current = suggestion
    onValueChange(suggestion)
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (suggestions.length === 0) return
      e.preventDefault()
      if (!showList) {
        setOpen(true)
        setActiveIndex(e.key === 'ArrowDown' ? 0 : suggestions.length - 1)
        return
      }
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(index => {
        if (index === -1) return step === 1 ? 0 : suggestions.length - 1
        return (index + step + suggestions.length) % suggestions.length
      })
    } else if (e.key === 'Enter') {
      const chosen = showList ? suggestions[activeIndex] : undefined
      if (chosen !== undefined) {
        e.preventDefault()
        select(chosen)
      }
    } else if (e.key === 'Escape' && showList) {
      e.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const activeOptionId =
    showList && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined

  return (
    <div className='CityInput'>
      <Input
        {...props}
        id={id}
        type='text'
        role='combobox'
        aria-autocomplete='list'
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        autoComplete='off'
        className={cn(className)}
        value={value}
        onChange={e => {
          skipValueRef.current = null
          onValueChange(e.target.value)
        }}
        onFocus={e => {
          focusedRef.current = true
          onFocus?.(e)
        }}
        onBlur={e => {
          focusedRef.current = false
          setOpen(false)
          setActiveIndex(-1)
          onBlur?.(e)
        }}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul id={listboxId} role='listbox' className='CityInput-list'>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listboxId}-option-${index}`}
              role='option'
              aria-selected={index === activeIndex}
              className={cn(
                'CityInput-option',
                index === activeIndex && 'CityInput-option--active'
              )}
              // mousedown fires before the input's blur, so the click is not lost.
              onMouseDown={e => {
                e.preventDefault()
                select(suggestion)
              }}
              onMouseEnter={() => setActiveIndex(index)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
