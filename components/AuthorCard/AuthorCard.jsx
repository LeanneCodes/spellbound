"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Link from "next/link";

const AuthorCard = () => {
    const [authors, setAuthors] = useState([]);
    const [books, setBooks] = useState([]); // Store books in state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/nyt");

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const jsonData = await res.json();
                console.log(jsonData); // Debugging

                // Extract books from lists
                const lists = jsonData?.results?.lists || [];
                const extractedBooks = lists.flatMap(list => list.books); // Flatten books array

                setBooks(extractedBooks); // Store books in state

                // Count how many books each author has
                const authorCount = extractedBooks.reduce((acc, book) => {
                    const author = book.author;
                    if (author) {
                        acc[author] = (acc[author] || 0) + 1;
                    }
                    return acc;
                }, {});

                // Convert to array & sort by count (descending order)
                const sortedAuthors = Object.entries(authorCount)
                    .map(([author, count]) => ({ author, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6); // Always take the top 6 authors

                setAuthors(sortedAuthors);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p className="text-center text-gray-700">Loading authors...</p>;
    if (error) return <p className="text-center text-red-500">Error! Unable to load authors at this moment.</p>;

    return (
        <div className="w-full mt-5 border-y-2 py-10">
          <ul key={authors.length} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {authors.map((authorData, index) => {
              const authorBooks = books?.length > 0 
                ? books.filter(book => book.author === authorData.author) 
                : [];
              const bookCover = authorBooks.length > 0 ? authorBooks[0].book_image : null;
      
              return (
                <li 
                  key={index} 
                  className="flex items-center bg-white overflow-hidden"
                >
                  {/* Image Container */}
                  {bookCover && (
                    <div className="w-28 h-36 flex-shrink-0 rounded-t-full overflow-hidden">
                      <img 
                        src={bookCover} 
                        alt="Book cover" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
      
                  {/* Author Info */}
                  <div className="flex flex-col justify-center px-6 py-4 flex-grow bg-white text-offBlack">
                    <Link href={`/author/${encodeURIComponent(authorData.author)}`}>
                        <h3 className="text-2xl font-extrabold leading-snug hover:scale-105 transition-transform duration-200 origin-left">
                            {authorData.author}
                        </h3>
                    </Link>
                    <p className="mt-1 text-sm tracking-wide">
                      {authorData.count} {authorData.count === 1 ? "Book" : "Books"} Charting
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
    );
      
};

export default AuthorCard;
