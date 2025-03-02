import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-beige text-offBlack pt-4 pb-10">
      <div className="w-full container mx-auto flex flex-col items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/spellbound-logo2.png" // Update with your actual logo path
            alt="Spellbound Logo"
            width={300} // Adjust size as needed
            height={200}
            priority
          />
        </Link>

        {/* Separator */}
        <hr className="w-full max-w-xs border-offBlack/50 mb-4" />

        {/* Copyright Text */}
        <p className="text-center text-sm text-offBlack">
          © {new Date().getFullYear()} Spellbound. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
