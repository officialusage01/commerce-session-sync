
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PromoSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-16">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Deals & Discounts</h2>
            <p className="text-purple-200 mb-6 text-lg">
              Explore our exclusive offers and save big on your favorite products.
            </p>
            <Button asChild className="bg-white text-purple-700 hover:bg-purple-100">
              <Link to="/search">Shop Now</Link>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-purple-600 p-8 rounded-lg max-w-md">
              <h3 className="text-2xl font-semibold mb-3">Limited Time Offer</h3>
              <p className="mb-4">Get up to 40% off on selected items</p>
              <div className="flex gap-3 text-4xl font-bold justify-center">
                <div className="bg-purple-800 p-3 rounded-md flex flex-col items-center">
                  <span>24</span>
                  <span className="text-xs font-normal">Days</span>
                </div>
                <div className="bg-purple-800 p-3 rounded-md flex flex-col items-center">
                  <span>12</span>
                  <span className="text-xs font-normal">Hours</span>
                </div>
                <div className="bg-purple-800 p-3 rounded-md flex flex-col items-center">
                  <span>36</span>
                  <span className="text-xs font-normal">Mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
