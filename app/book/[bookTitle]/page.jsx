"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Store, BookOpen } from "lucide-react";
import Link from "next/link";

const BookPage = () => {
  const params = useParams();
  const rawbookTitle = params.bookTitle;
  if (!rawbookTitle) {
    console.error("No bookTitle parameter found in URL");
  }

  const formattedbookTitle = rawbookTitle
    ? decodeURIComponent(rawbookTitle)
        .replace(/-/g, " ") // Convert hyphens to spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalise first letters
        .trim() // Remove any leading/trailing spaces
    : ""; // Fallback in case bookTitle is undefined

  const [book, setBook] = useState(null);
  const [relevantBooks, setRelevantBooks] = useState([]); // State for relevant books
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/nyt`); // Fetch bestseller list
        const data = await response.json();

        if (data?.results?.lists) {
          const allBooks = data.results.lists.flatMap((list) => list.books);

          // Match the book title by trimming any excess spaces and using case-insensitive comparison
          const matchedBook = allBooks.find((b) => {
            const bookTitle = b.title.trim().toLowerCase();
            const searchTitle = formattedbookTitle.toLowerCase();
            return bookTitle === searchTitle;
          });

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
          ]
            .slice(0, 6); // Limit to 6 books

          // Remove duplicates based on title using Set
          const uniqueBooks = [];
          const seenTitles = new Set();
          combinedRelevantBooks.forEach((book) => {
            if (!seenTitles.has(book.title)) {
              uniqueBooks.push(book);
              seenTitles.add(book.title);
            }
          });

          setRelevantBooks(uniqueBooks); // Set unique books in state
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
      <div className="max-w-5xl mx-auto bg-white p-6 flex flex-col md:flex-row gap-6">
        {book?.book_image && (
          <div className="w-60 h-full flex-shrink-0">
            <Image
              src={book.book_image}
              alt={book.title}
              width={200}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col flex-grow text-left">
          <h1 className="text-4xl font-bold">{book?.title}</h1>
          <Link href={`/author/${encodeURIComponent(book?.author)}`}>
            <p className="text-lg text-gray-700 mt-2">By: <span className="underline">{book?.author}</span></p>
          </Link>

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

      {/* Line separator */}
      <div className="border-t border-gray-300 my-8"></div>

      {/* Relevant Books Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Relevant Books</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {relevantBooks.map((relevantBook, index) => (
            <Link
              key={relevantBook.title}
              href={`/book/${encodeURIComponent(relevantBook.title.replace(/\s/g, "-"))}`} // Assuming the URL structure is like "/book/book-title"
            >
              <div
                className={`flex flex-col p-4 bg-white ${index !== relevantBooks.length - 1 ? '' : ''} transition-transform transform hover:scale-105`}
              >
                <div className="w-full h-full overflow-hidden">
                  {relevantBook.book_image ? (
                    <Image
                      src={relevantBook.book_image}
                      width={150}
                      height={250}
                      alt={relevantBook.title}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image Available</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between flex-grow mt-4 text-left space-y-1">
                  {relevantBook.weeks_on_list > 1 && (
                    <p className="text-gray-600 text-[12px] uppercase">
                      {relevantBook.weeks_on_list} weeks on the list
                    </p>
                  )}
                  {relevantBook.weeks_on_list == 1 && (
                    <p className="text-gray-600 text-[12px] uppercase">
                      New this week
                    </p>
                  )}
                  <h3 className="text-sm font-semibold">{relevantBook.title}</h3>
                  <p className="text-sm text-gray-600">By: {relevantBook.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
