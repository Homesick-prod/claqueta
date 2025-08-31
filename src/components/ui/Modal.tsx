import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-[var(--neutral-900)]/30 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div 
          className={`relative inline-block bg-white rounded-[var(--radius)] px-4 pt-5 pb-4 text-left overflow-hidden shadow-[var(--shadow-md)] transform transition-all sm:my-8 sm:align-middle sm:p-6 ${sizeClasses[size]} w-full`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between mb-[var(--spacing-4)]">
              <h3 
                id="modal-title"
                className="text-lg font-semibold text-[var(--neutral-900)]"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-[var(--radius)] hover:bg-[var(--neutral-50)] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[var(--neutral-500)]" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}