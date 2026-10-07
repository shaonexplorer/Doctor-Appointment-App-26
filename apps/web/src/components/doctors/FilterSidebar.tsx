'use client';

import { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpecialtyChip, SpecialtyChips } from './SpecialtyChip';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: DoctorFilters) => void;
  initialFilters?: Partial<DoctorFilters>;
  specialties?: FilterOption[];
  feeRange?: { min: number; max: number };
  className?: string;
}

export interface DoctorFilters {
  specialty: string[];
  minFee: number | null;
  maxFee: number | null;
  availableFrom: Date | null;
  availableTo: Date | null;
  consultationType: 'in_person' | 'video' | 'phone' | 'all';
  sortBy: 'relevance' | 'fee_asc' | 'fee_desc' | 'rating' | 'availability';
  onlyVerified: boolean;
  acceptsInsurance: boolean;
}

const defaultFilters: DoctorFilters = {
  specialty: [],
  minFee: null,
  maxFee: null,
  availableFrom: null,
  availableTo: null,
  consultationType: 'all',
  sortBy: 'relevance',
  onlyVerified: false,
  acceptsInsurance: false,
};

const consultationTypes: FilterOption[] = [
  { value: 'all', label: 'All types' },
  { value: 'in_person', label: 'In-person' },
  { value: 'video', label: 'Video visit' },
  { value: 'phone', label: 'Phone call' },
];

const sortOptions: FilterOption[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'availability', label: 'Soonest Available' },
];

const commonSpecialties: FilterOption[] = [
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Gastroenterology', label: 'Gastroenterology' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
  { value: 'ENT', label: 'ENT' },
  { value: 'Urology', label: 'Urology' },
];

export function FilterSidebar({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
  specialties = commonSpecialties,
  feeRange = { min: 0, max: 500 },
  className,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<DoctorFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    specialty: true,
    fee: true,
    availability: false,
    consultation: false,
    advanced: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFilters((prev) => ({
      ...prev,
      specialty: prev.specialty.includes(specialty)
        ? prev.specialty.filter((s) => s !== specialty)
        : [...prev.specialty, specialty],
    }));
  };

  const handleFeeChange = (min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, minFee: min, maxFee: max }));
  };

  const handleDateChange = (field: 'availableFrom' | 'availableTo', date: Date | null) => {
    setFilters((prev) => ({ ...prev, [field]: date }));
  };

  const handleSortChange = (sortBy: DoctorFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleToggle = (field: 'onlyVerified' | 'acceptsInsurance') => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const hasActiveFilters =
    filters.specialty.length > 0 ||
    filters.minFee !== null ||
    filters.maxFee !== null ||
    filters.availableFrom !== null ||
    filters.availableTo !== null ||
    filters.consultationType !== 'all' ||
    filters.sortBy !== 'relevance' ||
    filters.onlyVerified ||
    filters.acceptsInsurance;

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="bg-foreground/30 fixed inset-0 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'bg-card border-border fixed inset-y-0 right-0 z-50 w-full max-w-sm transform border-l shadow-xl transition-transform duration-200 lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
          className
        )}
        role="complementary"
        aria-label="Search filters"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-border flex items-center justify-between border-b p-4 lg:hidden">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
              aria-label="Close filters"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="space-y-6">
              {/* Specialty Filter */}
              <FilterSection
                title="Specialty"
                icon={<Stethoscope className="size-4" />}
                expanded={expandedSections.specialty}
                onToggle={() => toggleSection('specialty')}
              >
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search specialties..."
                      className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-4 pl-10 text-sm outline-none"
                      onChange={(_e) => {
                        // Could add search filtering here
                      }}
                    />
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  </div>
                  <SpecialtyChips
                    specialties={specialties.map((s) => s.value)}
                    variant="outline"
                    size="sm"
                    selected={filters.specialty}
                    onChange={handleSpecialtyChange}
                    maxVisible={12}
                  />
                  {filters.specialty.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {filters.specialty.map((s) => (
                        <SpecialtyChip
                          key={s}
                          label={s}
                          variant="primary"
                          size="sm"
                          selected
                          onClick={() => handleSpecialtyChange(s)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* Fee Range Filter */}
              <FilterSection
                title="Consultation Fee"
                icon={<DollarSign className="size-4" />}
                expanded={expandedSections.fee}
                onToggle={() => toggleSection('fee')}
              >
                <FeeRangeSlider
                  min={feeRange.min}
                  max={feeRange.max}
                  value={[filters.minFee ?? feeRange.min, filters.maxFee ?? feeRange.max]}
                  onChange={handleFeeChange}
                />
              </FilterSection>

              {/* Availability Filter */}
              <FilterSection
                title="Availability"
                icon={<Calendar className="size-4" />}
                expanded={expandedSections.availability}
                onToggle={() => toggleSection('availability')}
              >
                <div className="space-y-3">
                  <DateRangePicker
                    label="Available from"
                    value={filters.availableFrom}
                    onChange={(date) => handleDateChange('availableFrom', date)}
                    placeholder="Any date"
                  />
                  <DateRangePicker
                    label="Available to"
                    value={filters.availableTo}
                    onChange={(date) => handleDateChange('availableTo', date)}
                    placeholder="Any date"
                  />
                </div>
              </FilterSection>

              {/* Consultation Type Filter */}
              <FilterSection
                title="Consultation Type"
                icon={<MapPin className="size-4" />}
                expanded={expandedSections.consultation}
                onToggle={() => toggleSection('consultation')}
              >
                <div className="space-y-2">
                  {consultationTypes.map((type) => (
                    <label
                      key={type.value}
                      className="border-border hover:bg-secondary flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors"
                    >
                      <input
                        type="radio"
                        name="consultation-type"
                        value={type.value}
                        checked={filters.consultationType === type.value}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            consultationType: type.value as DoctorFilters['consultationType'],
                          }))
                        }
                        className="text-primary border-border focus:ring-primary size-4"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Advanced Filters */}
              <FilterSection
                title="Advanced"
                icon={<SlidersHorizontal className="size-4" />}
                expanded={expandedSections.advanced}
                onToggle={() => toggleSection('advanced')}
              >
                <div className="space-y-3">
                  <label className="border-border hover:bg-secondary flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3">
                    <div>
                      <p className="text-sm font-medium">Verified doctors only</p>
                      <p className="text-muted-foreground text-xs">Show only verified profiles</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.onlyVerified}
                      onChange={() => handleToggle('onlyVerified')}
                      className="text-primary border-border focus:ring-primary size-4 rounded"
                    />
                  </label>
                  <label className="border-border hover:bg-secondary flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3">
                    <div>
                      <p className="text-sm font-medium">Accepts insurance</p>
                      <p className="text-muted-foreground text-xs">
                        Filter by insurance acceptance
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.acceptsInsurance}
                      onChange={() => handleToggle('acceptsInsurance')}
                      className="text-primary border-border focus:ring-primary size-4 rounded"
                    />
                  </label>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Sort by</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleSortChange(e.target.value as DoctorFilters['sortBy'])}
                      className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border px-3 text-sm font-medium outline-none"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </FilterSection>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="border-primary/20 bg-primary/5 mt-6 rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-primary text-sm font-bold">Active filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filters.specialty.map((s) => (
                    <SpecialtyChip
                      key={s}
                      label={s}
                      variant="primary"
                      size="sm"
                      selected
                      onClick={() => handleSpecialtyChange(s)}
                    />
                  ))}
                  {filters.minFee !== null || filters.maxFee !== null ? (
                    <SpecialtyChip
                      label={`$${filters.minFee ?? feeRange.min} - $${filters.maxFee ?? feeRange.max}`}
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeeChange(null, null)}
                    />
                  ) : null}
                  {filters.consultationType !== 'all' && (
                    <SpecialtyChip
                      label={
                        consultationTypes.find((t) => t.value === filters.consultationType)
                          ?.label || ''
                      }
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters((prev) => ({ ...prev, consultationType: 'all' }))}
                    />
                  )}
                  {filters.onlyVerified && (
                    <SpecialtyChip
                      label="Verified only"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle('onlyVerified')}
                    />
                  )}
                  {filters.acceptsInsurance && (
                    <SpecialtyChip
                      label="Insurance accepted"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle('acceptsInsurance')}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-border border-t p-4 lg:hidden">
            <div className="flex gap-2">
              <button
                onClick={clearAllFilters}
                className="border-border text-muted-foreground hover:bg-secondary flex-1 rounded-xl border px-4 py-3 text-sm font-bold"
                disabled={!hasActiveFilters}
              >
                Clear all
              </button>
              <button
                onClick={handleApply}
                className="bg-primary text-primary-foreground flex-1 rounded-xl px-4 py-3 text-sm font-bold hover:opacity-90"
                disabled={!hasActiveFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function FilterSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border border-b last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-3 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <h3 className="text-base font-bold">{title}</h3>
        </div>
        {expanded ? (
          <ChevronUp className="text-muted-foreground size-5" />
        ) : (
          <ChevronDown className="text-muted-foreground size-5" />
        )}
      </button>
      {expanded && <div className="pt-2 pb-4">{children}</div>}
    </div>
  );
}

function FeeRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (min: number | null, max: number | null) => void;
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleMinChange = (v: number) => {
    const newMin = v > localValue[1] ? localValue[1] : v;
    setLocalValue([newMin, localValue[1]]);
  };

  const handleMaxChange = (v: number) => {
    const newMax = v < localValue[0] ? localValue[0] : v;
    setLocalValue([localValue[0], newMax]);
  };

  const handleApply = () => {
    onChange(
      localValue[0] === min ? null : localValue[0],
      localValue[1] === max ? null : localValue[1]
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">${localValue[0]}</span>
        <span className="text-muted-foreground">${localValue[1]}</span>
      </div>
      <div className="relative h-2">
        <div
          className="bg-primary/20 absolute inset-0 h-full rounded-full"
          style={{
            left: `${((localValue[0] - min) / (max - min)) * 100}%`,
            right: `${(1 - (localValue[1] - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
          aria-label="Minimum fee"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
          aria-label="Maximum fee"
        />
      </div>
      <button
        onClick={handleApply}
        className="bg-primary text-primary-foreground w-full rounded-xl px-4 py-2 text-sm font-bold hover:opacity-90"
      >
        Apply range
      </button>
    </div>
  );
}

function DateRangePicker({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
}) {
  const [localValue, setLocalValue] = useState<string>(
    value ? value.toISOString().split('T')[0] : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setLocalValue(dateStr);
    onChange(dateStr ? new Date(dateStr) : null);
  };

  return (
    <div>
      <label className="text-muted-foreground mb-1 block text-xs font-bold">{label}</label>
      <input
        type="date"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border px-3 text-sm outline-none"
      />
    </div>
  );
}

// Need to import Search icon
import { Search } from 'lucide-react';
import { Stethoscope } from 'lucide-react';
