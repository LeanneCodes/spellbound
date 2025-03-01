"use client";

import React, { useState } from 'react';
import useBookData from "@/hooks/useBookData";
import Image from "next/image";
import Button from "../Button/Button";

const BookCard = ({ showAll}) => {
  const { books, loading, error } = useBookData();

  if (loading) return <p className="text-center text-gray-700">Loading books...</p>;
  if (error) return <p className="text-center text-red-500">Error! Unable to load books at this moment.</p>;

  // Only show first 4 books if showAll is false
  const visibleBooks = showAll ? books : books.slice(0, 4);

  return (
    <div className="w-full mt-5">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {visibleBooks.map((book) => (
          <li key={book.primary_isbn13} className="flex flex-col h-full">
            <div className="w-full h-[350px] overflow-hidden">
              {book.book_image && (
                <Image
                  src={book.book_image}
                  width={150}
                  height={250}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  priority
                />
              )}
            </div>

            <div className="flex flex-col justify-between flex-grow mt-4 text-left space-y-1">
              <h3 className="text-sm font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">By: {book.author}</p>
              <p className="text-sm font-bold text-gray-700">Rank: {book.rank}</p>
              <div>
                <Button link={book.amazon_product_url} text={"Buy now"} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookCard;
