import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  ...props 
}: CardProps) {
  const baseClasses = "bg-white border border-[var(--neutral-200)] shadow-[var(--shadow-sm)]";
  
  const paddingClasses = {
    sm: "p-[var(--spacing-3)]",
    md: "p-[var(--spacing-4)]", 
    lg: "p-[var(--spacing-6)]"
  };
  
  const radiusClass = "rounded-[var(--radius)]";
  
  return (
    <div 
      className={`${baseClasses} ${paddingClasses[padding]} ${radiusClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}