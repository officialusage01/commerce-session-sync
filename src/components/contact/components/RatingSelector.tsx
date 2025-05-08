
import React from 'react';
import { Star } from 'lucide-react';

interface RatingSelectorProps {
  rating: number;
  setRating: (rating: number) => void;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ rating, setRating }) => {
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } hover:fill-yellow-400 hover:text-yellow-400`}
          onClick={() => handleRatingChange(value)}
        />
      ))}
    </div>
  );
};

export default RatingSelector;
