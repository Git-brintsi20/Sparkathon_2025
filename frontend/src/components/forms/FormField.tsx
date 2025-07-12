import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, LucideIcon } from 'lucide-react';

interface BaseFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  className?: string;
  labelClassName?: string;
  helperText?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'input';
  inputType?: 'text' | 'email' | 'tel' | 'url' | 'number' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  step?: string;
  min?: string;
  max?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

interface CheckboxFieldProps extends BaseFieldProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

interface RadioFieldProps extends BaseFieldProps {
  type: 'radio';
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string }>;
}

type FormFieldProps = 
  | InputFieldProps 
  | SelectFieldProps 
  | TextareaFieldProps 
  | CheckboxFieldProps 
  | RadioFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, name, error, required, icon: Icon, className, labelClassName, helperText } = props;

  const renderLabel = () => (
    <label 
      htmlFor={name} 
      className={`text-sm font-medium ${labelClassName || ''} ${required ? 'after:content-["*"] after:text-destructive after:ml-1' : ''}`}
    >
      {Icon && <Icon className="h-4 w-4 mr-2 inline" />}
      {label}
    </label>
  );

  const renderError = () => error && (
    <p className="text-sm text-destructive flex items-center gap-1 mt-1">
      <AlertCircle className="h-4 w-4" />
      {error}
    </p>
  );

  const renderHelperText = () => helperText && !error && (
    <p className="text-sm text-muted-foreground mt-1">
      {helperText}
    </p>
  );

  const fieldClassName = `${className || ''} ${error ? 'border-destructive' : ''}`;

  switch (props.type) {
    case 'input':
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Input
            id={name}
            name={name}
            type={props.inputType || 'text'}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            className={fieldClassName}
            step={props.step}
            min={props.min}
            max={props.max}
          />
          {renderError()}
          {renderHelperText()}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger className={fieldClassName}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError()}
          {renderHelperText()}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          {renderLabel()}
          <textarea
            id={name}
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${fieldClassName}`}
          />
          {renderError()}
          {renderHelperText()}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={props.checked}
              onChange={(e) => props.onChange(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <label htmlFor={name} className="text-sm font-medium cursor-pointer">
                {Icon && <Icon className="h-4 w-4 mr-2 inline" />}
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
              {props.description && (
                <p className="text-sm text-muted-foreground">{props.description}</p>
              )}
            </div>
          </div>
          {renderError()}
          {renderHelperText()}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {renderLabel()}
          <div className="space-y-2">
            {props.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-2">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={props.value === option.value}
                  onChange={(e) => props.onChange(e.target.value)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <div className="flex-1">
                  <label htmlFor={`${name}-${option.value}`} className="text-sm font-medium cursor-pointer">
                    {option.label}
                  </label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {renderError()}
          {renderHelperText()}
        </div>
      );

    default:
      return null;
  }
};

// Helper component for form sections
interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-1">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Helper component for form grids
interface FormGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6;
  className?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({
  children,
  cols = 2,
  gap = 4,
  className = ''
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gridGap = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6'
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gridGap[gap]} ${className}`}>
      {children}
    </div>
  );
};

// Helper component for checkbox groups
interface CheckboxGroupProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value: string[];
  onChange: (values: string[]) => void;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  cols?: 1 | 2 | 3;
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  icon: Icon,
  cols = 2,
  className = ''
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`text-sm font-medium ${required ? 'after:content-["*"] after:text-destructive after:ml-1' : ''}`}>
        {Icon && <Icon className="h-4 w-4 mr-2 inline" />}
        {label}
      </label>
      <div className={`grid ${gridCols[cols]} gap-2`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <label htmlFor={`${name}-${option.value}`} className="text-sm font-medium cursor-pointer">
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Helper component for form containers
interface FormContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  description,
  children,
  maxWidth = '2xl',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full'
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

// Validation helpers
export const createValidator = (rules: Record<string, (value: any) => string | undefined>) => {
  return (data: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    Object.entries(rules).forEach(([field, validator]) => {
      const error = validator(data[field]);
      if (error) {
        errors[field] = error;
      }
    });
    
    return errors;
  };
};

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required') => (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return undefined;
  },
  
  email: (message = 'Please enter a valid email address') => (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message;
    }
    return undefined;
  },
  
  phone: (message = 'Please enter a valid phone number') => (value: string) => {
    if (value && !/^[\+]?[\d\s\-\(\)]+$/.test(value)) {
      return message;
    }
    return undefined;
  },
  
  url: (message = 'Please enter a valid URL') => (value: string) => {
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      return message;
    }
    return undefined;
  },
  
  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return undefined;
  },
  
  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return undefined;
  },
  
  numeric: (message = 'Please enter a valid number') => (value: string) => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return undefined;
  },
  
  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return undefined;
  }
};

export default FormField;