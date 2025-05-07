
import React from 'react';

interface StoryNavigationProps {
  currentIndex: number;
  totalItems: number;
  onSwipe: (direction: 'up' | 'down') => void;
}

const StoryNavigation: React.FC<StoryNavigationProps> = ({
  currentIndex,
  totalItems,
  onSwipe
}) => {
  return (
    <>
      {/* Swipe handlers (invisible) */}
      <div 
        className="absolute inset-0 top-1/2 h-1/2 z-20"
        onClick={() => onSwipe('up')}
      />
      <div 
        className="absolute inset-0 bottom-1/2 h-1/2 z-20"
        onClick={() => onSwipe('down')}
      />
      
      {/* Navigation indicators */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 z-30">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === currentIndex 
                ? 'bg-white scale-125'
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default StoryNavigation;
