'use client';

import React, { useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  isNewest?: boolean;
}

/**
 * Toast notification component for user feedback
 * Shows success, error, or info messages with auto-dismiss
 */
export function Toast({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 3000,
  isNewest = true
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon className="w-5 h-5" />;
      case 'error':
        return <XMarkIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`transform transition-all duration-300 ease-out ${isNewest ? 'animate-slide-up' : 'animate-slide-down'}`}>
      <div className={`${getToastStyles()} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-[200px] max-w-[400px]`}>
        {getIcon() && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}