import React from "react";
import Image from "next/image";
import { ShoppingCart, Store, BookOpen } from "lucide-react";
import Link from "next/link";

const Modal = ({ book, onClose, children }) => {
  if (!book) return null; // Don't render if no book is selected

  const getStoreIcon = (storeName) => {
    if (storeName.includes("Amazon")) return <ShoppingCart size={16} />;
    if (storeName.includes("Apple")) return <BookOpen size={16} />;
    if (storeName.includes("Barnes & Noble")) return <Store size={16} />;
    return <Store size={16} />; // Default store icon
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-5xl w-full relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-black text-3xl font-bold"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Book Image */}
          {book.book_image && (
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

          {/* Book Details */}
          <div className="flex flex-col flex-grow text-left">
            <Link href={`/book/${encodeURIComponent(book.title)}`}>
              <h3 className="text-2xl font-bold underline">{book.title}</h3>
            </Link>
            <Link href={`/author/${encodeURIComponent(book.author)}`}>
            <p className="text-lg text-gray-700 mt-1">By: <span className="underline">{book.author}</span></p>
            </Link>
            

            {/* Weeks on List */}
            {book.weeks_on_list > 0 && (
              <p className="text-gray-600 text-sm mt-4">
                📚 On the bestseller list for <strong>{book.weeks_on_list}</strong> weeks
              </p>
            )}

            {/* ISBN Numbers */}
            <p className="text-gray-600 text-sm mt-4">
                <strong>ISBN-10:</strong> {book.primary_isbn10 || "N/A"}<br />
                <strong>ISBN-13:</strong> {book.primary_isbn13 || "N/A"}
            </p>

            <p className="text-gray-600 my-4">Description: {book.description}</p>

            {/* Buy Links - Styled as Buttons */}
            <h4 className="text-lg font-semibold mb-4">Where to buy this book (US stores):</h4>
            <div className="flex flex-wrap gap-3">
              {book.buy_links?.map((link, index) => (
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
      </div>
    </div>
  );
};

export default Modal;
