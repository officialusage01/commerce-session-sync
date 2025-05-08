
import React from 'react';
import { FEEDBACK_FIELD_LIMITS } from '@/lib/supabase/feedback';

interface CharacterCounterProps {
  currentCount: number;
  maxCount: number;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ 
  currentCount, 
  maxCount 
}) => {
  return (
    <span className={`absolute right-3 bottom-2 text-xs ${
      currentCount > maxCount * 0.8 
        ? 'text-amber-500' 
        : 'text-muted-foreground'
    }`}>
      {currentCount}/{maxCount}
    </span>
  );
};
