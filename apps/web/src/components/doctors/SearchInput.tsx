'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  debounceMs?: number;
  showFilterButton?: boolean;
  filterButtonLabel?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  onFilterClick,
  placeholder = 'Search doctors, specialties, symptoms...',
  debounceMs = 300,
  showFilterButton = true,
  filterButtonLabel = 'Filters',
  className,
  disabled = false,
  loading = false,
}: SearchInputProps) {
  const [showClear, setShowClear] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search value
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debounceMs, onSearch]);

  // Show clear button when input has value
  useEffect(() => {
    setShowClear(value.length > 0);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
    onSearch?.('');
    inputRef.current?.focus();
  }, [onChange, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch?.(value);
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [value, onSearch, handleClear]
  );

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <label htmlFor="doctor-search" className="sr-only">
        Search doctors
      </label>
      <div className="relative flex-1">
        <Search
          className={cn(
            'text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors',
            loading && 'animate-spin'
          )}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="doctor-search"
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'border-border bg-background h-11 w-full rounded-xl border pr-10 pl-10 text-sm transition-colors outline-none',
            'focus:border-primary focus:ring-primary/15 focus:ring-2',
            'placeholder:text-muted-foreground/60',
            disabled && 'bg-secondary text-muted-foreground cursor-not-allowed'
          )}
          autoComplete="off"
          aria-label="Search doctors, specialties, or symptoms"
          aria-autocomplete="list"
          role="combobox"
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:bg-secondary hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
        {loading && (
          <Loader2
            className="text-primary absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin"
            aria-hidden="true"
          />
        )}
      </div>

      {showFilterButton && onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={cn(
            'border-border bg-background text-muted-foreground flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors',
            'hover:bg-secondary hover:text-foreground focus:ring-primary/20 focus:ring-2 focus:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
          aria-label={filterButtonLabel}
        >
          <Filter className="size-4" />
          <span className="hidden sm:inline">{filterButtonLabel}</span>
        </button>
      )}
    </div>
  );
}

export interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

export function SearchSuggestions({ suggestions, onSelect, className }: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={cn(
        'border-border bg-card absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border shadow-lg',
        className
      )}
      role="listbox"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className={cn(
            'w-full px-4 py-3 text-left text-sm transition-colors',
            'hover:bg-secondary focus:bg-secondary focus:outline-none',
            index === suggestions.length - 1 ? '' : 'border-border border-b'
          )}
          role="option"
        >
          <Search className="text-muted-foreground mr-2 inline size-4" aria-hidden="true" />
          {suggestion}
        </button>
      ))}
    </div>
  );
}
