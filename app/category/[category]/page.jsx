"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const decodedCategory = decodeURIComponent(category); // Decode the URL-encoded category

  useEffect(() => {
    if (!decodedCategory) return;

    const fetchCategoryBooks = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        const categoryData = data.results.lists.find(list => list.list_name === decodedCategory);
        if (categoryData) {
          setBooks(categoryData.books);
        } else {
          setBooks([]); // No match found
        }
      } catch (error) {
        console.error("Error fetching category books:", error);
      }
    };

    fetchCategoryBooks();
  }, [decodedCategory]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{decodedCategory} Books</h1>
      {books.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book, index) => (
            <li key={index} className="border p-4 rounded-md shadow-md">
              <img src={book.book_image} alt={book.title} className="w-full h-64 object-cover rounded-md mb-2" />
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No books found for this category.</p>
      )}
    </div>
  );
}
