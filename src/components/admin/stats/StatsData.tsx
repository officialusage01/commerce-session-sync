
import { Shield, UserCheck, Users } from 'lucide-react';
import { StatsItem } from './StatsList';

export interface StatsDataProps {
  totalUsers: number;
  adminUsers: number;
  newUsersToday: number;
}

export const createStatsItems = (stats: StatsDataProps): StatsItem[] => {
  return [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      delay: 100
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: Shield,
      delay: 200
    },
    {
      title: "New Today",
      value: stats.newUsersToday,
      icon: UserCheck,
      delay: 300
    }
  ];
};
