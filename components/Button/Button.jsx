import Link from "next/link";
import React from "react";

const Button = ({ text, link, className = "", onClick }) => {
  const isExternal = link?.startsWith("http");

  return onClick ? (
    // If an onClick function is provided, use a normal button
    <button
      onClick={onClick}
      className={`py-2 px-4 text-xl font-semibold transition-all duration-300 ${className}`}
    >
      {text}
    </button>
  ) : isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button className={`py-2 px-4 text-xl font-semibold transition-all duration-300 ${className}`}>
        {text}
      </button>
    </a>
  ) : (
    <Link href={link}>
      <button className={`py-2 px-4 text-xl font-semibold transition-all duration-300 ${className}`}>
        {text}
      </button>
    </Link>
  );
};

export default Button;
