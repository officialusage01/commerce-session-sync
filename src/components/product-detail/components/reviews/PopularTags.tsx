
import React from 'react';

interface PopularTagsProps {
  tags: string[];
}

export const PopularTags: React.FC<PopularTagsProps> = ({ tags }) => {
  if (tags.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-2">Top Tags</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};
