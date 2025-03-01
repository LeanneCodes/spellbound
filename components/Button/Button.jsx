import Link from 'next/link'
import React from 'react'

const Button = ({ text, link }) => {
  const isExternal = link.startsWith("http");

  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button className="bg-black">
        <p className="text-xl text-white py-2 px-4 font-semibold">{text}</p>
      </button>
    </a>
  ) : (
    <Link href={link}>
      <button className="bg-black">
        <p className="text-xl text-white py-2 px-4 font-semibold">{text}</p>
      </button>
    </Link>
  );
};

export default Button;