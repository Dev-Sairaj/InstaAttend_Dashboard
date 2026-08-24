//updated
import React from 'react';

const StatCard = ({ data }) => {
  return (
    <div className="p-3 md:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1 */}
        <div className="flex justify-between items-center p-4 md:p-4 rounded-lg md:rounded-xl shadow-sm md:shadow-md bg-white transition-transform duration-200">
          <div className="mr-2">
            <p className="text-xs md:text-sm text-gray-500">{data[0].title}</p>
            <p className="text-xl md:text-2xl font-bold">{data[0].value}</p>
            <p className="text-xs md:text-sm text-gray-400">{data[0].subText}</p>
          </div>
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${data[0].iconBg}`}>
            {React.cloneElement(data[0].icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex justify-between items-center p-4 md:p-4 rounded-lg md:rounded-xl shadow-sm md:shadow-md bg-white transition-transform duration-200">
          <div className="mr-2">
            <p className="text-xs md:text-sm text-gray-500">{data[1].title}</p>
            <p className="text-xl md:text-2xl font-bold">{data[1].value}</p>
            <p className="text-xs md:text-sm text-gray-400">{data[1].subText}</p>
          </div>
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${data[1].iconBg}`}>
            {React.cloneElement(data[1].icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex justify-between items-center p-4 md:p-4 rounded-lg md:rounded-xl shadow-sm md:shadow-md bg-white transition-transform duration-200">
          <div className="mr-2">
            <p className="text-xs md:text-sm text-gray-500">{data[2].title}</p>
            <p className="text-xl md:text-2xl font-bold">{data[2].value}</p>
            <p className="text-xs md:text-sm text-gray-400">{data[2].subText}</p>
          </div>
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${data[2].iconBg}`}>
            {React.cloneElement(data[2].icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex justify-between items-center p-4 md:p-4 rounded-lg md:rounded-xl shadow-sm md:shadow-md bg-white transition-transform duration-200">
          <div className="mr-2">
            <p className="text-xs md:text-sm text-gray-500">{data[3].title}</p>
            <p className="text-xl md:text-2xl font-bold">{data[3].value}</p>
            <p className="text-xs md:text-sm text-gray-400">{data[3].subText}</p>
          </div>
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${data[3].iconBg}`}>
            {React.cloneElement(data[3].icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { StatCard };