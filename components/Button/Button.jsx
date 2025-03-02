import Link from "next/link";
import React from "react";

const Button = ({ text, link, className = "" }) => {
  const isExternal = link.startsWith("http");

  return isExternal ? (
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
