'use client';

import React from 'react';
import { Toast } from './Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

/**
 * Container component for managing multiple toast notifications
 * Stacks toasts vertically with proper spacing
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-3 right-2 sm:bottom-4 sm:right-4 z-50 flex flex-col-reverse space-y-reverse space-y-2 max-w-[95vw]">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="transform transition-all duration-300 ease-out"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => onRemove(toast.id)}
            duration={toast.duration}
            isNewest={index === 0} // First toast (newest) gets slide-up animation
          />
        </div>
      ))}
    </div>
  );
}
