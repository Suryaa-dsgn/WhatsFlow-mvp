import React, { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer,
  onClick,
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm ${className}`} 
      onClick={onClick}
    >
      {title && (
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 