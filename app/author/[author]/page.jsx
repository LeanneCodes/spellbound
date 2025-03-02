"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";

export default function AuthorPage() {
  const { author } = useParams();
  const [books, setBooks] = useState([]);
  const [authorImage, setAuthorImage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const decodedAuthor = decodeURIComponent(author);

  useEffect(() => {
    if (!decodedAuthor) return;

    const fetchAuthorData = async () => {
        try {
            const response = await fetch("/api/nyt");
            const data = await response.json();

            const allBooks = data.results?.lists?.flatMap((list) => list.books) || [];
            console.log("All Books Data:", allBooks);

            const filteredBooks = allBooks.filter((book) => {
                return book.author?.trim().toLowerCase().includes(decodedAuthor.trim().toLowerCase());
            });

            console.log("Filtered Books for", decodedAuthor, ":", filteredBooks);

            // Remove duplicate books based on title
            const uniqueBooks = Array.from(new Map(filteredBooks.map((book) => [book.title, book])).values());

            setBooks(uniqueBooks);

            // Use a dummy image for the author
            setAuthorImage("/portrait.jpg");
        } catch (error) {
            console.error("Error fetching author's books:", error);
        }
    };

    fetchAuthorData();
}, [decodedAuthor]);


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Author Info */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
          {authorImage && (
            <Image
              src={authorImage}
              alt={decodedAuthor}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              onError={() => setAuthorImage("/portrait.jpg")}
            />
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-800">{decodedAuthor}</h1>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <div
              key={book.title}
              className="flex flex-col h-full p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition cursor-pointer"
              onClick={() => {
                console.log("Opening modal for:", book);
                setSelectedBook(book);
              }}
            >
              <div className="w-full h-[350px] overflow-hidden">
                {book.book_image ? (
                  <Image
                    src={book.book_image}
                    width={150}
                    height={250}
                    alt={book.title}
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
                <h3 className="text-sm font-semibold">{book.title}</h3>
                <Button
                    text="More Details"
                    className="bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents bubbling issues
                        console.log("Book selected:", book); // Debugging log
                        setSelectedBook(book); // Update state
                    }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No books found for this author.</p>
      )}

      {/* Book Details Modal */}
      {selectedBook && console.log("Modal should be open for:", selectedBook)}
        {selectedBook && (
            <Modal book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}

    </div>
  );
}
