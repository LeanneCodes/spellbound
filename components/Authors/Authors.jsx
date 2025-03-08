"use client";

import React, { useState } from 'react';
import AuthorCard from '../AuthorCard/AuthorCard';

const Authors = () => {

    return (
        <div className="container mx-auto mb-20 px-10">
            <div className="flex w-full justify-between mt-20">
                <h2 className="text-3xl font-semibold">Trending Authors</h2>
            </div>

            <AuthorCard />
        </div>
    )
}

export default Authors
