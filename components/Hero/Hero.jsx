"use client";

import { useEffect, useState } from "react";
import Button from "../Button/Button";
import BookCarousel from "../BookCarousel/BookCarousel";
import Link from "next/link";
  
const Hero = () => {
    const [data, setData] = useState(null);
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
            console.log(jsonData); // Log to see full API response
            setData(jsonData);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        }
    
        fetchData();
    }, []);

    if (loading) return <p className="text-center">Loading books...</p>;
    if (error) return <p className="text-red-500 text-center">Error! Unable to load books at this moment.</p>;

    // Extract and flatten book lists
    const lists = data?.results?.lists || [];
    let books = lists.flatMap(list => list.books); // Flatten all books into a single array

    // Remove duplicate books based on ISBN
    const uniqueBooks = Array.from(new Map(books.map(book => [book.primary_isbn13, book])).values());

    // Limit to only the first 5 books for rotation
    const booksForCarousel = uniqueBooks.slice(0, 18);

    return (
      <div className="bg-beige w-full h-[500px]">
        <div className="flex flex-col md:flex-row h-[500px] justify-around items-center container mx-auto">
            <div className="space-y-4 w-full p-10">
                <h1 className="text-5xl lg:text-8xl font-semibold">
                    Find Your<br />Next Book
                </h1>
                <p className="text-lg md:text-2xl">
                    Showcasing the trending books and authors at <span className="font-semibold">Spellbound</span>.<br />Let us help you find your next read.
                </p>
                <div>
                    <Button link={"/books"} text={"Explore now"} className="bg-offBlack text-beige" />
                </div>
            </div>
            {/* Ensure the Carousel is fully centered */}
            <div className="hidden md:grid w-full h-full items-center justify-center relative">
                <BookCarousel books={booksForCarousel} />
            </div>

            {/* Pagination Indicator Outside */}
        <div className="hidden md:block swiper-pagination swiper-pagination-vertical !absolute transform -translate-y-1/2 h-1/2" style={{ "--swiper-pagination-color": "#0d0c22" }}></div>
        </div>
      </div>
    );
};
  
export default Hero;
  