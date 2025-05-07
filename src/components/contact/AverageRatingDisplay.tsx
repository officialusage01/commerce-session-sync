import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getFeedbackStats } from '@/lib/supabase/feedback';

const AverageRatingDisplay = () => {
  const [stats, setStats] = useState({ averageRating: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getFeedbackStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-pulse flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="flex justify-center space-x-1 mb-2">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Star
              className={`w-8 h-8 ${
                index < Math.round(stats.averageRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>
      <p className="text-2xl font-bold mb-1">
        {stats.averageRating.toFixed(1)}/5
      </p>
      <p className="text-sm text-muted-foreground">
        Based on {stats.totalCount} {stats.totalCount === 1 ? 'review' : 'reviews'}
      </p>
    </motion.div>
  );
};

export default AverageRatingDisplay;