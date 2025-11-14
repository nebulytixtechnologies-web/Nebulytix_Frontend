// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// Add this import:
import logo from "../assets/images/nebulytixLogo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow">
      <div className="container mx-2 flex items-center justify-between">
        <div className="flex mx-8 items-center gap-2 ">
          <img
            src={logo}
            alt="Nebulytix Technology Logo"
            className="h-28 w-28  object-contain"
          />
          {/* <Link to="/" className="text-xl font-bold text-sky-600">
            Nebulytix Technology
          </Link> */}
        </div>

        <div className="hidden md:flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-sky-600 font-semibold" : "text-gray-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/career"
            className={({ isActive }) =>
              isActive ? "text-sky-600 font-semibold" : "text-gray-700"
            }
          >
            Career
          </NavLink>
           <NavLink
            to="/contacts"
            className={({ isActive }) =>
              isActive ? "text-sky-600 font-semibold" : "text-gray-700"
            }
          >
            Contact
          </NavLink>
        </div>

        <div>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center w-full rounded-md border px-3 py-1 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Login <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {["admin", "hr", "employee"].map((r) => (
                  <Menu.Item key={r}>
                    {({ active }) => (
                      <button
                        onClick={() => navigate(`/login/${r}`)}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm`}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
