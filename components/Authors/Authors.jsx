"use client";

import React, { useState } from 'react';
import AuthorCard from '../AuthorCard/AuthorCard';

const Authors = () => {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className="container mx-auto mb-20">
            <div className="flex w-full justify-between mt-20">
                <h2 className="text-3xl font-semibold">Trending Authors</h2>
                <button 
                className="font-semibold" 
                onClick={() => setShowAll(!showAll)}
                >
                {showAll ? "Show less" : "See all"}
                </button>
            </div>

            {/* Pass the "showAll" state to AuthorCard */}
            <AuthorCard showAll={showAll} />
        </div>
    )
}

export default Authors
