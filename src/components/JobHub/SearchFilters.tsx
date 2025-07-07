import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { SearchFilters as SearchFiltersType } from '../../types'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof SearchFiltersType, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      minPay: 0,
      maxPay: 0,
      businessName: ''
    })
    setShowAdvanced(false)
  }

  const hasActiveFilters = filters.query || filters.minPay > 0 || filters.maxPay > 0 || filters.businessName
  const hasSearchQuery = filters.query.length > 0

  return (
    <div className="search-filters">
      <div className="search-bar">
        <div className="search-input-wrapper">
          {hasSearchQuery ? (
            <X size={20} className="search-icon clickable" onClick={clearFilters} />
          ) : (
            <Search size={20} className="search-icon" />
          )}
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className={`filter-toggle ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter size={20} />
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Min Pay ($/hr)</label>
              <input
                type="number"
                min="0"
                value={filters.minPay || ''}
                onChange={(e) => handleFilterChange('minPay', parseInt(e.target.value) || 0)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Max Pay ($/hr)</label>
              <input
                type="number"
                min="0"
                value={filters.maxPay || ''}
                onChange={(e) => handleFilterChange('maxPay', parseInt(e.target.value) || 0)}
                className="filter-input"
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Business Name</label>
            <input
              type="text"
              placeholder="Filter by business..."
              value={filters.businessName}
              onChange={(e) => handleFilterChange('businessName', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      )}
    </div>
  )
}