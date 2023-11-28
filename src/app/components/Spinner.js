import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid"></div>
    </div>
  );
};

export default Spinner;