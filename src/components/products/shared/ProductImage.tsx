import React from 'react';

interface ProductImageProps {
  imageUrl: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ 
  imageUrl, 
  name,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-24 h-24',
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const containerClasses = `
    bg-gray-50 
    rounded-lg 
    flex 
    items-center 
    justify-center 
    p-4 
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <img
        src={imageUrl}
        alt={name}
        className="max-h-full max-w-full object-contain rounded-lg"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
        }}
      />
    </div>
  );
};