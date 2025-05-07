
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Stock Market Analysis</h1>
        <p className="text-xl text-gray-600 mb-8">Track, analyze, and manage your stock market investments in one place.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/performance" className="bg-primary text-white p-4 rounded-lg hover:bg-primary/90 transition-colors">
            View Stock Performance
          </a>
          <a href="/dashboard" className="bg-secondary text-white p-4 rounded-lg hover:bg-secondary/90 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
