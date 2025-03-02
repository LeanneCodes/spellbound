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
          src={"/category-bg.jpg"}
          alt="bookshelf"
          width={2000}
          height={2000}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <h1 className="relative text-beige text-5xl font-bold text-center">
          {decodedCategory}
        </h1>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {books.slice(0, visibleCount).map((book, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedBook(book)} // Open modal on click
              >
                <img
                  src={book.book_image}
                  alt={book.title}
                  className="w-full h-80 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-semibold text-center">{book.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                <Button
                  text="More details"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
                  onClick={() => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleCount < books.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="bg-black text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
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
