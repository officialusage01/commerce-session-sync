
import React from 'react';

// In a real application, these would come from the database
const brands = [
  { id: 1, name: "TechGear", logo: "TG" },
  { id: 2, name: "HomeStyle", logo: "HS" },
  { id: 3, name: "FashionForward", logo: "FF" },
  { id: 4, name: "SportsPro", logo: "SP" },
  { id: 5, name: "GadgetZone", logo: "GZ" },
  { id: 6, name: "HealthPlus", logo: "H+" }
];

const TopBrands: React.FC = () => {
  return (
    <div className="py-12 bg-white border-t border-b border-slate-100">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Trusted Brands</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map(brand => (
            <div 
              key={brand.id} 
              className="flex items-center justify-center h-24 bg-slate-50 rounded-md hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  {brand.logo}
                </div>
                <span className="text-sm font-medium">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBrands;
