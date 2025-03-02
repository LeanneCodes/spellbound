import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";

const RelevantBooks = ({ books }) => {
    // Filter out duplicate books by title
    const uniqueBooks = Array.from(new Set(books.map((book) => book.title)))
      .map((title) => books.find((book) => book.title === title));
  
    return (
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-6">Other books you may enjoy</h3>
        {uniqueBooks?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {uniqueBooks.map((book, index) => (
              <div
                key={index}
                className="bg-white h-max p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                {book?.book_image && (
                  <Image
                    src={book.book_image}
                    alt={book.title}
                    width={120}
                    height={180}
                    className="w-full h-full object-cover rounded-lg mb-4"
                  />
                )}
  
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">{book?.title.replace(/-/g, " ")}</h4> {/* Replace hyphens with spaces */}
                  <p className="text-sm text-gray-600">{book?.author}</p>
                </div>
  
                {/* Use the Button component for the "View book" link */}
                <Button
                text={"View book"}
                link={`/book/${book.title.replace(/ /g, "-")}`} // Replace spaces with hyphens
                className="bg-offBlack text-beige mt-2"
              />
              </div>
            ))}
          </div>
        ) : (
          <p>No relevant books found.</p>
        )}
      </div>
    );
  };
  
  export default RelevantBooks;