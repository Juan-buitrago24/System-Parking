import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={inputType}
          className={`
            block w-full rounded-lg border-2 transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${type === 'password' ? 'pr-10' : 'pr-4'}
            py-3 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${className}
          `}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-slide-down">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
