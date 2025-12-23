import React from 'react';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ErrorCardProps } from '../types';

export const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  code,
  onRetry,
  className,
}) => {
  const isAuthError = code === 401 || code === 403 || message.toLowerCase().includes('unauthorized');
  const isNotFound = code === 404 || message.toLowerCase().includes('not found');

  const getErrorConfig = () => {
    if (isAuthError) {
      return {
        icon: XCircle,
        title: 'Authentication Error',
        gradient: 'from-red-600 to-rose-600',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
      };
    }
    if (isNotFound) {
      return {
        icon: AlertCircle,
        title: 'Not Found',
        gradient: 'from-amber-600 to-orange-600',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
      };
    }
    return {
      icon: AlertCircle,
      title: 'Error Occurred',
      gradient: 'from-red-600 to-rose-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    };
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in',
        className
      )}
    >
      {/* Header */}
      <div className={cn('bg-gradient-to-r px-4 py-3', config.gradient)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">{config.title}</h3>
            {code && (
              <p className="text-white/80 text-sm">Error Code: {code}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', config.iconBg)}>
            <IconComponent className={cn('w-5 h-5', config.iconColor)} />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 text-sm">{message}</p>
            
            {isAuthError && (
              <p className="text-gray-500 text-xs mt-2">
                Please check your authentication credentials and try again.
              </p>
            )}
          </div>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorCard;
