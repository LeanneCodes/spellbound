"use client";

import React, { useState } from 'react';
import BookCard from '../BookCard/BookCard';

const Bestsellers = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="container mx-auto mb-20">
      <div className="flex w-full justify-between mt-20">
        <h2 className="text-3xl font-semibold">Bestsellers</h2>
        <button 
          className="font-semibold" 
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "See all"}
        </button>
      </div>

      {/* Pass the "showAll" state to BookCard */}
      <BookCard showAll={showAll} />
    </div>
  );
};

export default Bestsellers;
