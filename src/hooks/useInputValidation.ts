import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  customValidator?: (value: string) => ValidationResult;
}

export const useInputValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateText = (value: string, rules: ValidationRules, fieldName: string): ValidationResult => {
    // Check required
    if (rules.required && (!value || value.trim().length === 0)) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    // Skip other validations if empty and not required
    if (!value && !rules.required) {
      return { isValid: true };
    }

    // Check length limits
    if (rules.maxLength && value.length > rules.maxLength) {
      return { isValid: false, error: `${fieldName} must be ${rules.maxLength} characters or less` };
    }

    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, error: `${fieldName} must be at least ${rules.minLength} characters` };
    }

    // Check for potentially malicious content
    const dangerousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /on\w+=/gi,
      /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
      /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
      /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(value)) {
        return { isValid: false, error: `${fieldName} contains invalid characters` };
      }
    }

    // Check email format
    if (rules.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
    }

    // Check custom pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      return { isValid: false, error: `${fieldName} format is invalid` };
    }

    // Custom validator
    if (rules.customValidator) {
      return rules.customValidator(value);
    }

    return { isValid: true };
  };

  const validateField = (value: string, rules: ValidationRules, fieldName: string): boolean => {
    const result = validateText(value, rules, fieldName);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (result.isValid) {
        delete newErrors[fieldName];
      } else {
        newErrors[fieldName] = result.error || 'Invalid input';
      }
      return newErrors;
    });

    return result.isValid;
  };

  const validateForm = (formData: Record<string, string>, validationRules: Record<string, ValidationRules>): boolean => {
    const newErrors: Record<string, string> = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName] || '';
      const rules = validationRules[fieldName];
      const result = validateText(value, rules, fieldName);
      
      if (!result.isValid) {
        newErrors[fieldName] = result.error || 'Invalid input';
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    validateText
  };
};

// Predefined validation rules for common use cases
export const commonValidationRules = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  email: {
    required: false,
    maxLength: 255,
    email: true
  },
  eventTitle: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  eventDescription: {
    required: true,
    minLength: 10,
    maxLength: 2000
  },
  location: {
    required: true,
    minLength: 5,
    maxLength: 500
  }
};