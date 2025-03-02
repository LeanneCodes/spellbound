"use client";

import { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Authors", href: "/authors" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [hasUpdate, setHasUpdate] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        if (data?.results?.lists) {
          const categoryNames = data.results.lists.map(list => list.list_name);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await fetch("/api/nyt");
        const data = await response.json();

        if (!data?.results?.lists) return;

        const newList = data.results.lists.flatMap(list => list.books.map(book => book.title));
        const storedList = JSON.parse(localStorage.getItem("bestsellers")) || [];

        if (JSON.stringify(storedList) !== JSON.stringify(newList)) {
          setHasUpdate(true);
          localStorage.setItem("bestsellers", JSON.stringify(newList));
        }
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };

    fetchBestsellers();
  }, []);

  const handleNotificationClick = () => {
    if (hasUpdate) {
      toast.success("The bestseller list has been updated! Check it out.");
      setHasUpdate(false);
    }
  };

  return (
    <Disclosure as="nav" className="bg-beige">
      <div className="mx-auto container px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-18 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start h-full">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Image src={"/spellbound-logo2.png"} alt="logo" width={250} height={150} priority />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex items-center h-18 justify-center">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} className="font-normal hover:font-extrabold rounded-md px-3 py-2 text-md text-offBlack">
                    {item.name}
                  </Link>
                ))}

                {/* Categories Dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="font-normal hover:font-extrabold rounded-md px-3 py-2 text-md text-offBlack">
                    Categories
                  </MenuButton>
                  <MenuItems className="absolute z-10 mt-2 w-48 bg-white shadow-lg ring-1 ring-black/5 rounded-md py-1">
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <MenuItem key={index}>
                          <button
                            onClick={() => router.push(`/category/${encodeURIComponent(category)}`)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {category}
                          </button>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>
                        <span className="block px-4 py-2 text-sm text-gray-500">Loading...</span>
                      </MenuItem>
                    )}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Notification Bell */}
            <button onClick={handleNotificationClick} className="relative p-1 rounded-full bg-beige text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6 text-offBlack" />
              {hasUpdate && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
