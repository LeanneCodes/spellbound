"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Store, BookOpen } from "lucide-react";
import Link from "next/link";
import RelevantBooks from "@/components/RelevantBooks/RelevantBooks";

const BookPage = () => {
  const params = useParams();
  console.log("Params from useParams:", params); // Debugging
  const rawbookTitle = params.bookTitle; // Get from URL
  console.log(rawbookTitle);
  if (!rawbookTitle) {
    console.error("No bookTitle parameter found in URL");
  }

  const formattedbookTitle = rawbookTitle
    ? decodeURIComponent(rawbookTitle)
        .replace(/-/g, " ") // Convert hyphens to spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalise first letters
        .trim() // Remove any leading/trailing spaces
    : ""; // Fallback in case bookTitle is undefined

  console.log("Formatted Book Name:", formattedbookTitle); // Debugging

  const [book, setBook] = useState(null);
  const [relevantBooks, setRelevantBooks] = useState([]); // State for relevant books
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/nyt`); // Fetch bestseller list
        const data = await response.json();
        console.log("API Response:", data);

        if (data?.results?.lists) {
          const allBooks = data.results.lists.flatMap((list) => list.books);
          console.log("All Books Extracted:", allBooks);

          console.log("Formatted Book Name:", formattedbookTitle);

          // Match the book title by trimming any excess spaces and using case-insensitive comparison
          const matchedBook = allBooks.find((b) => {
            const bookTitle = b.title.trim().toLowerCase(); // Normalize API title
            const searchTitle = formattedbookTitle.toLowerCase(); // Normalize formatted title
            return bookTitle === searchTitle;
          });

          console.log("Matched Book:", matchedBook);
          if (!matchedBook) console.warn("No book found for:", formattedbookTitle);

          setBook(matchedBook || null);

          // Fetch relevant books (by same author or same category)
          const relevantBooksByAuthor = allBooks.filter(
            (b) => b.author === matchedBook?.author && b.title !== matchedBook?.title
          );
          
          const relevantBooksByCategory = allBooks.filter(
            (b) => b?.category === matchedBook?.category && b.title !== matchedBook?.title
          );
          
          const combinedRelevantBooks = [
            ...relevantBooksByAuthor,
            ...relevantBooksByCategory
          ].slice(0, 6); // Limit to 6 books
          
          setRelevantBooks(combinedRelevantBooks);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formattedbookTitle) fetchBookDetails();
  }, [formattedbookTitle]); // Use formattedbookTitle here
  
  if (loading) return <div className="text-center py-20">Loading book details...</div>;
  if (!book) return <div className="text-center py-20">Book not found.</div>;

  const getStoreIcon = (storeName) => {
    if (storeName.includes("Amazon")) return <ShoppingCart size={16} />;
    if (storeName.includes("Apple")) return <BookOpen size={16} />;
    if (storeName.includes("Barnes & Noble")) return <Store size={16} />;
    return <Store size={16} />;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Main Book Info Section */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
        {book?.book_image && (
          <div className="w-48 h-72 flex-shrink-0">
            <Image
              src={book.book_image}
              alt={book.title}
              width={200}
              height={300}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="flex flex-col flex-grow text-left">
          <h1 className="text-4xl font-bold">{book?.title}</h1>
          <p className="text-lg text-gray-700 mt-2">By: {book?.author}</p>

          {book?.weeks_on_list > 0 && (
            <p className="text-gray-600 text-sm mt-3">
              📚 On the bestseller list for <strong>{book.weeks_on_list}</strong> weeks
            </p>
          )}

          <p className="text-gray-600 text-sm mt-3">
            <strong>ISBN-10:</strong> {book?.primary_isbn10 || "N/A"}<br />
            <strong>ISBN-13:</strong> {book?.primary_isbn13 || "N/A"}
          </p>

          <p className="text-gray-600 my-4">{book?.description}</p>

          <h4 className="text-lg font-semibold mb-4">Where to buy this book (US stores):</h4>
          <div className="flex flex-wrap gap-3">
            {book?.buy_links?.map((link, index) => (
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
      </div>

      {/* Relevant Books Component Section */}
      <RelevantBooks books={relevantBooks} />
    </div>
  );
};

export default BookPage;
