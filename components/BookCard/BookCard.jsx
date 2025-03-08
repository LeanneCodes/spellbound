"use client";

import React, { useState } from "react";
import useBookData from "@/hooks/useBookData";
import Image from "next/image";
import Button from "../Button/Button";
import { ShoppingCart, Store, BookOpen } from "lucide-react";
import Link from "next/link";

const BookCard = ({ showAll }) => {
  const { lists, loading, error } = useBookData();
  const [selectedBook, setSelectedBook] = useState(null);

  if (loading) return <p className="text-center text-gray-700">Loading books...</p>;
  if (error) return <p className="text-center text-red-500">Error! Unable to load books at this moment.</p>;

  // Extract books and remove duplicates
  const allBooks = lists?.flatMap((list) => list.books) || [];
  const uniqueBooks = Array.from(new Map(allBooks.map(book => [book.primary_isbn13, book])).values());
  const displayedBooks = uniqueBooks.slice(0, 18);
  const visibleBooks = showAll ? displayedBooks : displayedBooks.slice(0, 6);

  const getStoreIcon = (storeName) => {
    if (storeName.includes("Amazon")) return <ShoppingCart size={16} />;
    if (storeName.includes("Apple")) return <BookOpen size={16} />;
    if (storeName.includes("Barnes & Noble")) return <Store size={16} />;
    return <Store size={16} />; // Default store icon
  };

  return (
    <div className="w-full mt-5 border-y-2 py-10">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-16">
        {visibleBooks.map((book, index) => (
          <li
            key={book.primary_isbn13}
            className="flex flex-col h-full pr-8"
            style={{
              borderRight: (index + 1) % 6 !== 0 ? "1px solid #D1D5DB" : "none", // No right border on last item in each row
            }}
          >
            <div className="flex justify-center items-start gap-4">
              <div>
                <span className="text-4xl font-medium text-grey">{index + 1}</span>
              </div>
              <div className="w-full overflow-hidden">
                {book.book_image && (
                  <Image
                    src={book.book_image}
                    width={100}
                    height={250}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    priority
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col justify-end flex-grow mt-4 text-left">
              {book.weeks_on_list > 1 && (
                <p className="text-gray-600 text-[12px] uppercase">
                  {book.weeks_on_list} weeks on the list
                </p>
              )}
              {book.weeks_on_list == 1 && (
                <p className="text-gray-600 text-[12px] uppercase">
                  New this week
                </p>
              )}
              <h3 className="text-[16px] font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-3">By: {book.author}</p>

              <div>
                <Button onClick={() => setSelectedBook(book)} text={"More details"} className="bg-offBlack text-beige hover:bg-beige hover:text-offBlack" />
              </div>
            </div>
          </li>
        ))}
      </ul>


      {/* Full-Screen Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            >
              ✖
            </button>

            {/* Modal Content */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Image */}
              {selectedBook.book_image && (
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <Image
                    src={selectedBook.book_image}
                    alt={selectedBook.title}
                    width={200}
                    height={300}
                    className="rounded-md shadow-md w-full"
                  />
                </div>
              )}

              {/* Book Details */}
              <div className="flex-1 space-y-4">
                <Link href={`/book/${encodeURIComponent(selectedBook.title)}`}>
                  <h3 className="text-2xl font-bold underline">{selectedBook.title}</h3>
                </Link>
                <Link href={`/author/${encodeURIComponent(selectedBook.author)}`}>
                <p className="text-lg text-gray-700">By: <span className="underline">{selectedBook.author}</span></p>
                </Link>
                
                {/* Weeks on List */}
                {selectedBook.weeks_on_list > 0 && (
                  <p className="text-gray-600 text-sm">
                    📚 On the bestseller list for <strong>{selectedBook.weeks_on_list}</strong> weeks
                  </p>
                )}

                {/* ISBN Numbers */}
                <p className="text-gray-600 text-sm">
                  <strong>ISBN-10:</strong> {selectedBook.primary_isbn10 || "N/A"}<br />
                  <strong>ISBN-13:</strong> {selectedBook.primary_isbn13 || "N/A"}
                </p>

                {/* Book Description */}
                <p className="text-sm text-gray-800">Description: {selectedBook.description || "No description available."}</p>

                {/* Buy Links Section */}
                {selectedBook.buy_links?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Where to buy this book (US stores):</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {selectedBook.buy_links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-offBlack text-white text-sm font-medium p-2 rounded-lg hover:bg-beige hover:text-offBlack transition"
                        >
                          {getStoreIcon(link.name)}
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
