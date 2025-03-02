"use client";

import { useEffect, useState } from "react";
import Button from "../Button/Button";

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
        <div className="w-full mt-5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {authors.map((authorData, index) => {
                    const authorBooks = books.filter(book => book.author === authorData.author); // Get books by this author
                    const bookCover = authorBooks.length > 0 ? authorBooks[0].book_image : null; // Use the first book cover found

                    return (
                        <li 
                            key={index} 
                            className="flex items-center gap-4 p-6 bg-offBlack rounded-xl shadow-lg border border-beige/20 
                                       hover:scale-105 hover:bg-opacity-90 transition-transform duration-300 ease-in-out"
                        >
                            {/* Book Cover (if available) */}
                            {bookCover && (
                                <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-beige/30">
                                    <img 
                                        src={bookCover} 
                                        alt="Book cover" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Author Info */}
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-extrabold text-beige leading-snug">
                                    {authorData.author}
                                </h3>
                                <p className="mt-1 text-sm text-beige/80 tracking-wide">
                                    {authorData.count} {authorData.count === 1 ? "Book" : "Books"} Charting
                                </p>

                                {/* Learn More Button */}
                                <div className="mt-4">
                                    <Button 
                                        link={`/authors/${encodeURIComponent(authorData.author)}`} 
                                        text={"Learn more"} 
                                        className="bg-beige text-offBlack hover:bg-offBlack hover:text-beige" 
                                    />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AuthorCard;
