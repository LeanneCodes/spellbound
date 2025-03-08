"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Categories', href: '#', current: false, dropdown: true },
  { name: 'Authors', href: '#', current: false, dropdown: true },
];

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        if (data?.results?.lists) {
          const categoryNames = data.results.lists.map((list) => list.list_name);
          setCategories(categoryNames);

          const uniqueAuthors = Array.from(
            new Set(data.results.lists.flatMap((list) => list.books.map((book) => book.author)))
          );

          const books = data.results.lists.flatMap((list) => list.books.map((book) => book.title));
          setAllBooks(Array.from(new Set(books))); // Ensure unique book titles

          setAuthors(uniqueAuthors);
          setFilteredAuthors(uniqueAuthors);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setAuthors([]);
        setFilteredAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter authors based on search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = authors.filter((author) =>
      author.toLowerCase().includes(query)
    );
    setFilteredAuthors(filtered);
  };

  // Filter book search
  const handleBookSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setBookSearchQuery(query);
  
    if (query) {
      setFilteredBooks(allBooks.filter((book) => book.toLowerCase().includes(query)));
    } else {
      setFilteredBooks([]);
    }
  };
  

  // Function to reset navbar after selecting an option
  const resetNavbar = () => {
    setBookSearchQuery(""); // Clear book search
    setOpenDropdown(null); // Close dropdowns
    setIsMobileOpen(false); // Close mobile navbar
  };

  return (
    <Disclosure as="nav" className="bg-beige">
      {({ open }) => (
        <>
          <div className="mx-auto container px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-offBlack hover:font-bold">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block size-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block size-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:justify-between">
                <div className="flex shrink-0 items-center">
                  <Link href={"/"}>
                    <Image
                      src={'/spellbound-logo-short.png'}
                      alt='logo'
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 h-full justify-between w-full items-center">
                    <div className='flex'>
                      {navigation.map((item) => (
                        item.dropdown ? (
                          <Menu as="div" className="relative" key={item.name}>
                            <MenuButton 
                              className="text-offBlack hover:font-bold rounded-md px-3 py-2 text-sm font-medium">
                              {item.name}
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-2 w-64 bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto z-50">
                              {item.name === "Categories" && (
                                <>
                                  {loading ? (
                                    <MenuItem as="div" className="block px-4 py-2 text-gray-500">Loading...</MenuItem>
                                  ) : categories.length === 0 ? (
                                    <MenuItem as="div" className="block px-4 py-2 text-gray-500">No categories found</MenuItem>
                                  ) : (
                                    categories.map((category, index) => (
                                      <MenuItem key={index} as="a" href={`/category/${encodeURIComponent(category)}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        {category}
                                      </MenuItem>
                                    ))
                                  )}
                                </>
                              )}
                              {item.name === "Authors" && (
                                <>
                                  <div className="p-2">
                                    <input
                                      type="text"
                                      value={searchQuery}
                                      onChange={handleSearch}
                                      placeholder="Search authors..."
                                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring focus:ring-indigo-500 focus:outline-none"
                                    />
                                  </div>
                                  {loading ? (
                                    <MenuItem as="div" className="block px-4 py-2 text-gray-500">Loading...</MenuItem>
                                  ) : filteredAuthors.length === 0 ? (
                                    <MenuItem as="div" className="block px-4 py-2 text-gray-500">No authors found</MenuItem>
                                  ) : (
                                    filteredAuthors.map((author, index) => (
                                      <MenuItem key={index} as="a" href={`/author/${author.replace(/\s+/g, '-').toLowerCase()}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        {author}
                                      </MenuItem>
                                    ))
                                  )}
                                </>
                              )}
                            </MenuItems>
                          </Menu>
                        ) : (
                          <Link key={item.name} href={item.href} className="text-offBlack font-bold rounded-md px-3 py-2 text-sm" onClick={resetNavbar}>
                            {item.name}
                          </Link>
                        )
                      ))}
                    </div>
                    
                    <div className="relative w-64">

                      <div className="relative w-64">
                        {/* Search Icon */}
                        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offBlack text-sm" />

                        {/* Search Input */}
                        <input
                          type="text"
                          value={bookSearchQuery}
                          onChange={handleBookSearch}
                          placeholder="Search books..."
                          className="w-full pl-10 px-3 py-2 text-sm placeholder-offBlack border-b-[1px] border-grey bg-transparent focus:outline-none focus:ring-0"
                        />
                      </div>

                      {bookSearchQuery && (
                        <div className="absolute bg-white w-full mt-1 border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                          {filteredBooks.length > 0 ? (
                            filteredBooks.map((book, index) => (
                              <Link 
                                key={index} 
                                href={`/book/${book.replace(/\s+/g, '-').toLowerCase()}`} 
                                className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={resetNavbar}
                              >
                                {book}
                              </Link>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500">No results found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  

                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation (Restored) */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {/* Home Link */}
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-offBlack hover:font-bold"
                onClick={resetNavbar}
              >
                Home
              </Link>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-offBlack hover:font-bold"
                  onClick={() => setOpenDropdown(openDropdown === "Categories" ? null : "Categories")}
                >
                  Categories
                </button>
                {openDropdown === "Categories" && (
                  <div className="mt-1 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto z-50">
                    {loading ? (
                      <div className="px-4 py-2 text-gray-500">Loading...</div>
                    ) : categories.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No categories found</div>
                    ) : (
                      categories.map((category, index) => (
                        <Link
                          key={index}
                          href={`/category/${encodeURIComponent(category)}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={resetNavbar}
                        >
                          {category}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Authors Dropdown */}
              <div className="relative">
                <button
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-offBlack hover:font-bold"
                  onClick={() => setOpenDropdown(openDropdown === "Authors" ? null : "Authors")}
                >
                  Authors
                </button>
                {openDropdown === "Authors" && (
                  <div className="mt-1 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto z-50">
                    <div className="p-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search authors..."
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    {loading ? (
                      <div className="px-4 py-2 text-gray-500">Loading...</div>
                    ) : filteredAuthors.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No authors found</div>
                    ) : (
                      filteredAuthors.map((author, index) => (
                        <Link
                          key={index}
                          href={`/author/${author.replace(/\s+/g, '-').toLowerCase()}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={resetNavbar}
                        >
                          {author}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative w-full">

                <div className="relative w-full">
                  {/* Search Icon */}
                  <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offBlack text-sm" />

                  {/* Search Input */}
                  <input
                    type="text"
                    value={bookSearchQuery}
                    onChange={handleBookSearch}
                    placeholder="Search books..."
                    className="w-full pl-10 px-3 py-2 text-sm placeholder-offBlack border-b-[1px] border-grey bg-transparent focus:outline-none focus:ring-0"
                  />
                </div>

                {bookSearchQuery && (
                  <div className="absolute bg-white w-full mt-1 border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book, index) => (
                        <Link 
                          key={index} 
                          href={`/book/${book.replace(/\s+/g, '-').toLowerCase()}`} 
                          className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={resetNavbar}
                        >
                          {book}
                        </Link>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No results found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
