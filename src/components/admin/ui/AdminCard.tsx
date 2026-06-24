import type { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export default function AdminCard({
  children,
  className = '',
  padding = 'md',
}: AdminCardProps) {
  return (
    <div className={`admin-card ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  );
}
