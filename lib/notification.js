import { useEffect, useState } from "react";
import { VscBell, VscBellDot } from "react-icons/vsc";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5"; // Import close and info icon
import Image from "next/image"; // Import Next.js Image component

export default function NotificationBell() {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkBestsellerUpdate = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        if (data?.results?.lists) {
          const latestBooks = data.results.lists.flatMap((list) =>
            list.books.map((book) => ({ title: book.title, author: book.author }))
          );
          const latestUpdateTime = new Date();

          const storedBooks = JSON.parse(localStorage.getItem("bestsellerBooks"));
          const storedTime = localStorage.getItem("bestsellerLastUpdate");

          if (!storedBooks || !storedTime) {
            localStorage.setItem("bestsellerBooks", JSON.stringify(latestBooks));
            localStorage.setItem("bestsellerLastUpdate", latestUpdateTime);
            setIsUpdated(true);
            setIsLoaded(true);
            return;
          }

          const storedDate = new Date(storedTime);
          const timeDifference = (latestUpdateTime - storedDate) / (1000 * 60 * 60);

          const hasChanged = JSON.stringify(storedBooks) !== JSON.stringify(latestBooks);
          setIsUpdated(hasChanged && timeDifference <= 48);
          setIsLoaded(true);

          localStorage.setItem("bestsellerBooks", JSON.stringify(latestBooks));
          localStorage.setItem("bestsellerLastUpdate", latestUpdateTime);
        }
      } catch (error) {
        console.error("Error checking bestseller list:", error);
      }
    };

    checkBestsellerUpdate();
  }, []);

  const handleClick = () => {
    if (!isLoaded) {
      setMessage("Checking for updates...");
      return;
    }

    if (isUpdated) {
      setMessage("The bestseller book list has been updated!");
    } else {
      setMessage(<span className="flex items-center gap-2"><IoInformationCircleOutline className="text-blue-500 text-xl" /> The bestseller book list has not changed.<br />Come back again next week.</span>);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={handleClick} 
        className="cursor-pointer flex items-center justify-center p-2 rounded-full focus:outline-none"
      >
        {isUpdated ? (
          <VscBellDot className="text-offBlack text-lg" />
        ) : (
          <VscBell className="text-offBlack text-lg" />
        )}
      </button>

      {/* Full-Screen Centered Modal */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative flex flex-col items-center">
            <Image src="/spellbound-logo-full.png" alt="Spellbound Logo" width={300} height={300} />
            <p className="text-black text-lg font-medium mt-4">{message}</p>
            <button 
              onClick={() => setMessage("")} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
