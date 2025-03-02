import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-beige text-offBlack py-8">
      <div className="w-full container mx-auto px-6 flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="mb-4">
          <Image
            src="/spellbound-logo2.png" // Update with your actual logo path
            alt="Spellbound Logo"
            width={200} // Adjust size as needed
            height={200}
            priority
          />
        </Link>

        {/* Separator */}
        <hr className="w-full max-w-xs border-offBlack/50 my-4" />

        {/* Copyright Text */}
        <p className="text-center text-sm text-offBlack">
          © {new Date().getFullYear()} Spellbound. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
