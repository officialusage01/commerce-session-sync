
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui-components/Button';
import { ChartLine, TrendingUp, Clock, BarChart3, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { calculateMonthlyPerformance } from '@/services/stockPerformance';
import { getAllStocks } from '@/services/stockQuery';
import { StockData } from '@/components/stock/types';

const Home: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const allStocks = await getAllStocks();
        setStocks(allStocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Filter stocks for different time periods
  const getCurrentDate = () => new Date();
  const currentDate = getCurrentDate();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

  // Filter stocks by date ranges
  const yearlyStocks = stocks.filter(stock => 
    new Date(stock.entryDate).getFullYear() === currentYear
  );

  const monthlyStocks = stocks.filter(stock => 
    new Date(stock.entryDate).getFullYear() === currentYear && 
    new Date(stock.entryDate).getMonth() === currentMonth
  );

  const weeklyStocks = stocks.filter(stock => {
    const entryDate = new Date(stock.entryDate);
    return entryDate >= currentWeekStart && entryDate <= currentDate;
  });

  // Calculate performance metrics
  const yearlyPerformance = calculateMonthlyPerformance(yearlyStocks);
  const monthlyPerformance = calculateMonthlyPerformance(monthlyStocks);
  const weeklyPerformance = calculateMonthlyPerformance(weeklyStocks);
  
  return (
    <div className="pt-24 pb-16 min-h-screen animate-fade-in bg-gradient-to-br from-blue-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <ChartLine className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 tracking-tight animate-slide-in">
            Stock Market <span className="text-blue-600">Insights and Performance</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 animate-slide-in" style={{ animationDelay: '100ms' }}>
            Actionable insights and powerful analytics to track, analyze, and optimize your investment portfolio.
          </p>
          <div className="mt-10 flex justify-center animate-slide-in" style={{ animationDelay: '200ms' }}>
            <Link to="/performance">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Performance
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Track Your Investment Journey</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Wonder how your stock performance measures up? Dive into the detailed performance insights 
            to track your progress and uncover key trends.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow animate-blur-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-5">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
            <p className="text-gray-600">
              Stay informed with the latest market trends and insights to make informed investment decisions.
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow animate-blur-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-5">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-gray-600">
              Detailed analytics and visualizations to help you understand your investment performance at a glance.
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow animate-blur-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-5">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Historical Data</h3>
            <p className="text-gray-600">
              Access historical performance data to identify patterns and improve your investment strategy.
            </p>
          </div>
        </div>
      </section>
      
      {/* Performance Metrics Carousel */}
      <section className="mt-16 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Performance Metrics</h2>
          <p className="text-gray-600 mt-2">Track your investment performance across different time periods</p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {/* Current Year Performance */}
            <CarouselItem>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">{currentYear} Performance</CardTitle>
                  <CardDescription className="text-center">Yearly overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Trades</p>
                      <p className="text-2xl font-bold">{yearlyPerformance.totalTrades}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {yearlyPerformance.totalTrades > 0 
                          ? `${Math.round((yearlyPerformance.successTrades / yearlyPerformance.totalTrades) * 100)}%` 
                          : "0%"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Avg. Duration</p>
                      <p className="text-2xl font-bold">{Math.round(yearlyPerformance.avgTradeDuration)} days</p>
                    </div>
                    <div className={`p-4 ${yearlyPerformance.monthlyProfitLossPercentage >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg`}>
                      <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
                      <p className={`text-2xl font-bold ${yearlyPerformance.monthlyProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {yearlyPerformance.monthlyProfitLossPercentage > 0 ? '+' : ''}
                        {yearlyPerformance.monthlyProfitLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
            
            {/* Monthly Performance */}
            <CarouselItem>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                  </CardTitle>
                  <CardDescription className="text-center">Monthly overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Trades</p>
                      <p className="text-2xl font-bold">{monthlyPerformance.totalTrades}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {monthlyPerformance.totalTrades > 0 
                          ? `${Math.round((monthlyPerformance.successTrades / monthlyPerformance.totalTrades) * 100)}%` 
                          : "0%"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Avg. Duration</p>
                      <p className="text-2xl font-bold">{Math.round(monthlyPerformance.avgTradeDuration)} days</p>
                    </div>
                    <div className={`p-4 ${monthlyPerformance.monthlyProfitLossPercentage >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg`}>
                      <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
                      <p className={`text-2xl font-bold ${monthlyPerformance.monthlyProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {monthlyPerformance.monthlyProfitLossPercentage > 0 ? '+' : ''}
                        {monthlyPerformance.monthlyProfitLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
            
            {/* Weekly Performance */}
            <CarouselItem>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Current Week</CardTitle>
                  <CardDescription className="text-center">Weekly overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Trades</p>
                      <p className="text-2xl font-bold">{weeklyPerformance.totalTrades}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {weeklyPerformance.totalTrades > 0 
                          ? `${Math.round((weeklyPerformance.successTrades / weeklyPerformance.totalTrades) * 100)}%` 
                          : "0%"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Avg. Duration</p>
                      <p className="text-2xl font-bold">{Math.round(weeklyPerformance.avgTradeDuration)} days</p>
                    </div>
                    <div className={`p-4 ${weeklyPerformance.monthlyProfitLossPercentage >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg`}>
                      <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
                      <p className={`text-2xl font-bold ${weeklyPerformance.monthlyProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {weeklyPerformance.monthlyProfitLossPercentage > 0 ? '+' : ''}
                        {weeklyPerformance.monthlyProfitLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-0 lg:-left-12" />
          <CarouselNext className="right-0 lg:-right-12" />
        </Carousel>
      </section>
      
      <section className="mt-20 py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to analyze your investments?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Click here to explore your stock performance and see the numbers behind your investments.
          </p>
          <Link to="/performance">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              View Performance Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
