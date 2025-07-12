import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/components/lib/utils';

interface SearchSuggestion {
  id: string;
  label: string;
  category?: string;
}

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  suggestions = [],
  showSuggestions = true,
  className,
  disabled = false,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on search term
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setSelectedIndex(-1);
    onChange?.(newValue);
    
    if (showSuggestions && newValue.length > 0) {
      setShowSuggestionsList(true);
    } else {
      setShowSuggestionsList(false);
    }
  };

  // Handle search submission
  const handleSearch = (term: string = searchTerm) => {
    onSearch?.(term);
    setShowSuggestionsList(false);
    inputRef.current?.blur();
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.label);
    onChange?.(suggestion.label);
    handleSearch(suggestion.label);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsExpanded(true);
    if (showSuggestions && searchTerm.length > 0) {
      setShowSuggestionsList(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setTimeout(() => {
      setIsExpanded(false);
      setShowSuggestionsList(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm('');
    onChange?.('');
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  // Update search term when value prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            'pl-10 pr-10 transition-all duration-200',
            isExpanded && 'ring-2 ring-ring ring-offset-2',
            className
          )}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestionsList && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm rounded-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground',
                selectedIndex === index && 'bg-accent text-accent-foreground'
              )}
            >
              <div className="flex items-center justify-between">
                <span>{suggestion.label}</span>
                {suggestion.category && (
                  <span className="text-xs text-muted-foreground">
                    {suggestion.category}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;