import React from 'react';

interface ProductImageProps {
  imageUrl: string;
  name: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ imageUrl, name }) => {
  return (
    <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full h-[300px] relative">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
          }}
        />
      </div>
    </div>
  );
};