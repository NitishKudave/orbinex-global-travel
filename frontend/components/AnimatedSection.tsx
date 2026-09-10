'use client';

import React from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

export default function AnimatedSection({
  children,
  className = '',
}: AnimatedSectionProps) {
  return (
    <div className={`transition-opacity duration-300 ${className}`}>
      {children}
    </div>
  );
}

export const FadeInUp: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
}) => (
  <div className={`transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const HoverLift: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`hover:-translate-y-1 hover:shadow-lg transition-transform duration-200 ${className}`}>
    {children}
  </div>
);

