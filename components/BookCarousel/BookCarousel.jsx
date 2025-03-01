"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BookCarousel = ({ books }) => {
  // Divide books into groups of 3
  const bookRows = [];
  for (let i = 0; i < books.length; i += 3) {
    bookRows.push(books.slice(i, i + 3));
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={30}
        loop={false}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        className="w-full h-[500px]"
      >
        {bookRows.map((row, index) => (
          <SwiperSlide key={index} className="grid place-items-center h-full">
            <div className="grid grid-cols-3 gap-4 place-items-center w-full h-full">
              {row.map((book, bookIndex) => (
                <div key={bookIndex} className="grid justify-items-center text-center">
                  {/* Middle Book: Title & Author above the image */}
                  {bookIndex === 1 && (
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  )}

                  {/* Book Image */}
                  <div className="w-full h-full overflow-hidden">
                    <Image
                      src={book.book_image}
                      width={230}
                      height={180}
                      alt={book.title}
                      className={`object-cover overflow-hidden ${
                        bookIndex === 1 ? "rounded-b-full" : "rounded-t-full"
                      }`}
                    />
                  </div>

                  {/* Left & Right Books: Title & Author below the image */}
                  {bookIndex !== 1 && (
                    <div className="mt-2">
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookCarousel;
