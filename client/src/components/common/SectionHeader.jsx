import React from 'react';

export const SectionHeader = ({
  subtitle,
  title,
  align = 'center',
  className = '',
  description = '',
}) => {
  const alignClasses = {
    center: 'text-center mx-auto items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-12 ${alignClasses[align]} ${className}`}>
      {subtitle && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {subtitle}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};
