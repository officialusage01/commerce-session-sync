
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <Card className="animate-slide-in" style={{ animationDelay: `${delay}ms` }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
