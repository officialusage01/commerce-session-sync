
import React from 'react';
import StatsList from './stats/StatsList';
import { StatsDataProps, createStatsItems } from './stats/StatsData';

interface StatsGridProps {
  stats: StatsDataProps;
}

const StatsCardGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statsItems = createStatsItems(stats);
  
  return <StatsList items={statsItems} />;
};

export default StatsCardGrid;
