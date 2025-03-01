"use client";

import { useState } from "react";
import Image from "next/image";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage("Thank you for subscribing!");
      setEmail(""); // Clear input after successful submission
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full bg-navy text-white flex flex-col md:flex-row">
      {/* Left: Image */}
      <div className="w-full md:w-1/2">
        <Image
          src="/spellbound-newsletter.png"
          alt="Collection of books"
          width={500}
          height={500}
          priority
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Newsletter Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 text-center">
        <h3 className="text-3xl font-semibold">Subscribe to our newsletter</h3>
        <p className="text-lg text-gray-300 mt-2">
          Get the latest updates on bestsellers, new arrivals, and exclusive offers.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-black focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-md"
            >
              Subscribe
            </button>
          </div>
          {message && <p className="mt-3 text-sm">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
