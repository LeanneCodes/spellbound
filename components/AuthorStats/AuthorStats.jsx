import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const AuthorStats = () => {
  const { author } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/search/authors.json?q=${author}`);
        const data = await response.json();
        const authorDetails = data?.docs[0]; // Get the first result from the search
        setAuthorData(authorDetails);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch author data");
        setLoading(false);
      }
    };

    if (author) {
      fetchAuthorData();
    }
  }, [author]);

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!authorData) return <p className="text-center text-gray-700">No author data found</p>;

  const {
    name,
    birth_date,
    top_work,
    work_count,
    ratings_average,
    ratings_count,
    want_to_read_count,
    already_read_count,
    currently_reading_count,
  } = authorData;

  return (
    <div className="max-w-7xl mx-auto py-16 px-10 text-beige">
      <div className="flex flex-col gap-8">
        {/* Author Info */}
        <div className="text-center">
          <h2 className="text-5xl font-semibold mb-2">{name}</h2>
          {birth_date && <p className="text-lg text-beige">Born: {birth_date}</p>}
        </div>

        {/* Author Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Top Work */}
          {top_work && (
            <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
              <h3 className="text-lg font-semibold text-gray-800">Top Work</h3>
              <p className="text-xl text-gray-700">{top_work}</p>
            </div>
          )}

          {/* Works Published */}
          <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
            <h3 className="text-lg font-semibold text-gray-800">Works Published</h3>
            <p className="text-xl text-gray-700">{work_count}</p>
          </div>

          {/* Average Rating */}
          <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
            <h3 className="text-lg font-semibold text-gray-800">Average Rating</h3>
            <p className="text-xl text-gray-700">
              {ratings_average ? ratings_average.toFixed(2) + " / 5" : "N/A"}
            </p>
          </div>

          {/* Total Ratings */}
          <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
            <h3 className="text-lg font-semibold text-gray-800">Total Ratings</h3>
            <p className="text-xl text-gray-700">
              {ratings_count ? ratings_count.toFixed(0) : "N/A"}
            </p>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Want to Read */}
          <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
            <h3 className="text-lg font-semibold text-gray-800">Added to User's Wishlist</h3>
            <p className="text-xl text-gray-700">
                {want_to_read_count ? want_to_read_count.toFixed(0) : "N/A"}
            </p>
          </div>

          {/* Already Read */}
          <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
            <h3 className="text-lg font-semibold text-gray-800">No. of Users Read</h3>
            <p className="text-xl text-gray-700">
                {already_read_count ? already_read_count.toFixed(0) : "N/A"}
            </p>
          </div>

          {/* Currently Reading */}
          <div className="bg-beige p-6 rounded-lg shadow-md text-center flex justify-center items-center flex-col">
            <h3 className="text-lg font-semibold text-gray-800">Users Currently Reading</h3>
            <p className="text-xl text-gray-700">
                {currently_reading_count ? currently_reading_count.toFixed(0) : "N/A"}
            </p>
          </div>
        </div>

      </div>

      <p className="text-sm text-center mt-6">*Stats are from the Open Library</p>
    </div>
  );
};

export default AuthorStats;
