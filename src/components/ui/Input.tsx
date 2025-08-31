import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error,
  className = '', 
  id,
  ...props 
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = "w-full px-[var(--spacing-3)] py-[var(--spacing-2)] border border-[var(--neutral-200)] bg-[var(--neutral-50)] text-[var(--neutral-900)] placeholder-[var(--neutral-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/50 focus:border-[var(--brand)] transition-all";
  
  const radiusClass = "rounded-[var(--radius)]";
  
  const errorClasses = error 
    ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/50"
    : "";
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--neutral-800)] mb-[var(--spacing-1)]"
        >
          {label}
        </label>
      )}
      <input 
        id={inputId}
        className={`${baseClasses} ${radiusClass} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-[var(--spacing-1)] text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}