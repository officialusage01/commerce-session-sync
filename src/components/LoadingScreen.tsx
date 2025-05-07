
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-80 backdrop-blur-sm animate-fade-in z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-r-primary opacity-70 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
        </div>
        <p className="mt-4 text-lg font-medium text-primary animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
