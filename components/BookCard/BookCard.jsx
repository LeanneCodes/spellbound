"use client";

import React from "react";
import useBookData from "@/hooks/useBookData";
import Image from "next/image";

const BookCard = () => {
  const { books, loading, error } = useBookData();

  if (loading) return <p className="text-center text-gray-700">Loading books...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">NYT Best Sellers</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {books.map((book) => (
          <li key={book.primary_isbn13} className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300">
            {book.book_image && (
              <Image
                src={book.book_image}
                width={150}
                height={230}
                alt={book.title}
                className="w-full h-auto rounded-md"
                priority
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">By: {book.author}</p>
              <p className="text-sm font-bold text-gray-700">Rank: {book.rank}</p>
              <a
                href={book.amazon_product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Buy on Amazon
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookCard;
