import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading delicious flavors...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-primary/20 border-t-primary animate-spin`}
      />
      {text && <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">{text}</p>}
    </div>
  );
};
