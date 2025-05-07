
import React from 'react';
import { LucideIcon } from 'lucide-react';
import StatsCard from '../StatsCard';

export interface StatsItem {
  title: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
}

interface StatsListProps {
  items: StatsItem[];
}

const StatsList: React.FC<StatsListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {items.map((item, index) => (
        <StatsCard
          key={`stat-${item.title}-${index}`}
          title={item.title}
          value={item.value}
          icon={item.icon}
          delay={item.delay || index * 100}
        />
      ))}
    </div>
  );
};

export default StatsList;
