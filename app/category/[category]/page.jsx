"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";

export default function CategoryPage() {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedBook, setSelectedBook] = useState(null);
  const decodedCategory = decodeURIComponent(category);

  useEffect(() => {
    if (!decodedCategory) return;

    const fetchCategoryBooks = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        const categoryData = data.results.lists.find(
          (list) => list.list_name === decodedCategory
        );
        if (categoryData) {
          setBooks(categoryData.books);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching category books:", error);
      }
    };

    fetchCategoryBooks();
  }, [decodedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Banner */}
      <div className="relative w-full h-64 bg-gray-300 flex items-center justify-center mb-8">
        <Image
          src={"/category-bg3.jpg"}
          alt="bookshelf"
          width={2000}
          height={2000}
          className="absolute inset-0 w-full h-full object-cover object-bottom opacity-40"
        />
        <h1 className="relative text-white text-5xl font-bold text-center">
          {decodedCategory}
        </h1>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-b py-10 border-gray-300 gap-y-10">
            {books.slice(0, visibleCount).map((book, index) => (
              <div
                key={index}
                className={`flex flex-col p-4 border-r border-gray-300 bg-white ${
                  (index + 1) % 6 === 0 ? "border-r-0" : ""
                }`}
                onClick={() => setSelectedBook(book)}
              >
                {/* Number & Image Container */}
                <div className="flex items-start justify-center gap-x-6">
                  {/* Position Number */}
                  <span className="text-4xl font-medium text-gray-500">{index + 1}</span>

                  {/* Book Image */}
                  <div className="w-full overflow-hidden">
                    <img
                      src={book.book_image}
                      alt={book.title}
                      className="w-full object-cover"
                    />
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex flex-col flex-grow mt-4 text-left justify-end">
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                  {/* More Details Button */}
                  <Button
                    text="More details"
                    className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-beige hover:text-offBlack transition"
                    onClick={() => setSelectedBook(book)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleCount < books.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-beige hover:text-offBlack transition"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">No books found for this category.</p>
      )}

      {/* Book Details Modal */}
      {selectedBook && <Modal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
