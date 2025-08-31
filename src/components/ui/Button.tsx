import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 focus:ring-[var(--brand)]/50",
    secondary: "bg-[var(--neutral-200)] text-[var(--neutral-900)] hover:bg-[var(--neutral-200)]/80 focus:ring-[var(--neutral-500)]/30 border border-[var(--neutral-200)]",
    ghost: "text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] focus:ring-[var(--neutral-500)]/30",
    danger: "bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90 focus:ring-[var(--danger)]/50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };
  
  const radiusClass = "rounded-[var(--radius)]";
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${radiusClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}