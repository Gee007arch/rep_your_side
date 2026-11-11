import React from 'react';

export interface PillProps {
  children: React.ReactNode;
  variant?: 'orange-pill' | 'purple-pill' | 'green-pill' | '';
  className?: string;
}

export function Pill({ children, variant = '', className = '' }: PillProps) {
  return (
    <span className={`pill ${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}

