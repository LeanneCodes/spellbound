"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import AuthorStats from "@/components/AuthorStats/AuthorStats";

export default function AuthorPage() {
  const { author } = useParams();
  const [books, setBooks] = useState([]);
  const [authorImage, setAuthorImage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const decodedAuthor = decodeURIComponent(author).replace(/-/g, " ").trim().toLowerCase();

  console.log(decodedAuthor)

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

        } catch (error) {
            console.error("Error fetching author's books:", error);
        }
    };

    fetchAuthorData();
}, [decodedAuthor]);


  return (
    <div>
      <div className="bg-navy">
        <AuthorStats />
      </div>

      <div className="container mx-auto px-8 py-4">
        {/* Books List */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 py-10 gap-y-10">
            {books.map((book, index) => (
              <div
                key={book.title}
                className={`flex flex-col justify-between p-4 border-r border-gray-300 bg-white ${
                  (index + 1) % 6 === 0 ? "border-r-0" : ""
                }`}
              >
                {/* Book Image */}
                <div className="w-full h-full overflow-hidden mb-4">
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

                <div className="flex flex-col justify-end">
                  {/* Book Position & Title */}
                  <div className="flex items-center justify-start gap-x-6">
                    {/* Position Number */}
                    <span className="text-4xl font-medium text-gray-500">{index + 1}</span>

                    {/* Book Title */}
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                  </div>

                  {/* "More Details" Button */}
                  <Button
                    text="More Details"
                    className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-beige hover:text-offBlack transition mt-4"
                    onClick={() => setSelectedBook(book)}
                  />
                </div>

                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No books found for this author.</p>
        )}

        {/* Book Details Modal */}
        {selectedBook && <Modal book={selectedBook} onClose={() => setSelectedBook(null)} />}
      </div>
      
    </div>
  );
}
