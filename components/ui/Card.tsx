import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, noPadding = false }) => {
  return (
    <div className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}>
      {title && (
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};