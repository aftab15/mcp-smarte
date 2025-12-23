import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { LoadingCardProps } from '../types';

export const LoadingCard: React.FC<LoadingCardProps> = ({
  message = 'Loading data...',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in',
        className
      )}
    >
      <div className="p-8 flex flex-col items-center justify-center">
        {/* Animated Loader */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 animate-ping absolute inset-0" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>

        {/* Message */}
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
        
        {/* Skeleton Preview */}
        <div className="mt-6 w-full max-w-sm space-y-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
