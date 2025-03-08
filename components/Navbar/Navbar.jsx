"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { VscBell, VscBellDot } from "react-icons/vsc";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Categories', href: '#', current: false, dropdown: true },
  { name: 'Authors', href: '#', current: false, dropdown: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState(["J.K. Rowling", "Stephen King", "Agatha Christie", "George Orwell"]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks which dropdown is open in mobile view

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        if (data?.results?.lists) {
          const categoryNames = data.results.lists.map((list) => list.list_name);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block size-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block size-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      item.dropdown ? (
                        <Menu as="div" className="relative" key={item.name}>
                          <MenuButton 
                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                            {item.name}
                          </MenuButton>
                          <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                            {item.name === "Categories" && (
                              loading ? (
                                <MenuItem as="div" className="block px-4 py-2 text-gray-500">Loading...</MenuItem>
                              ) : categories.length === 0 ? (
                                <MenuItem as="div" className="block px-4 py-2 text-gray-500">No categories available</MenuItem>
                              ) : (
                                categories.map((category, index) => (
                                  <MenuItem key={index} as="a" href={`/categories/${category}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    {category}
                                  </MenuItem>
                                ))
                              )
                            )}
                            {item.name === "Authors" && (
                              authors.map((author, index) => (
                                <MenuItem key={index} as="a" href={`/authors/${author.replace(/\s+/g, '-').toLowerCase()}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                  {author}
                                </MenuItem>
                              ))
                            )}
                          </MenuItems>
                        </Menu>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                item.dropdown ? (
                  <div key={item.name} className="relative">
                    <button
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    >
                      {item.name}
                    </button>
                    {openDropdown === item.name && (
                      <div className="mt-1 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                        {item.name === "Categories" && (
                          loading ? (
                            <div className="px-4 py-2 text-gray-500">Loading...</div>
                          ) : categories.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">No categories available</div>
                          ) : (
                            categories.map((category, index) => (
                              <Link key={index} href={`/categories/${category}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                {category}
                              </Link>
                            ))
                          )
                        )}
                        {item.name === "Authors" && (
                          authors.map((author, index) => (
                            <Link key={index} href={`/authors/${author.replace(/\s+/g, '-').toLowerCase()}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                              {author}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.name} href={item.href} className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
