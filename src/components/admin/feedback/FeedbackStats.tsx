
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Star, Users } from 'lucide-react';
import { getFeedbackStats, getRatingDistribution } from '@/lib/supabase/feedback';

interface FeedbackStatsProps {
  productFeedbackCount: number;
  userFeedbackCount: number;
}

const FeedbackStats: React.FC<FeedbackStatsProps> = ({ 
  productFeedbackCount, 
  userFeedbackCount 
}) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        // Get general feedback stats
        const stats = await getFeedbackStats();
        setAverageRating(stats.averageRating);
        
        // Get rating distribution
        const distribution = await getRatingDistribution();
        setRatingDistribution(distribution);
      } catch (error) {
        console.error('Error loading feedback stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const totalFeedback = productFeedbackCount + userFeedbackCount;

  const statsCards = [
    {
      title: 'Total Feedback',
      value: totalFeedback,
      icon: <Users className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Average Rating',
      value: isLoading ? '...' : averageRating.toFixed(1),
      icon: <Star className="h-5 w-5 text-yellow-500" />
    },
    {
      title: 'Product Feedback',
      value: productFeedbackCount,
      icon: <ChartPie className="h-5 w-5 text-green-500" />
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Feedback Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedbackStats;
