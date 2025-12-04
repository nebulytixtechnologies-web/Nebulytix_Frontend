// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShieldCheck, Users, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/nebulytixLogo.jpg";



export default function Navbar() {
  const navigate = useNavigate();

  const roleIcons = {
    admin: <ShieldCheck size={16} className="text-[#0D243C]" />,
    hr: <Users size={16} className="text-[#0D243C]" />,
    employee: <User size={16} className="text-[#0D243C]" />,
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/career", label: "Career" },
    { to: "/contacts", label: "Contact" },
    { to: "/about", label: "About" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-md sticky top-0 z-40"
    >
      <div className="w-full px-6 lg:px-10 py-2 flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 220 }}
        >
          <img
            src={logo}
            alt="Nebulytix Logo"
            className="h-12 w-auto object-contain"
          />
        </motion.div>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-8 text-[15px] font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative group ${
                  isActive ? "text-[#0D243C] font-semibold" : "text-gray-600"
                }`
              }
            >
              {link.label}
              <span
                className="absolute left-0 bottom-0 w-full h-[2px] bg-[#0D243C]
                scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              ></span>
            </NavLink>
          ))}
        </div>

        {/* LOGIN DROPDOWN */}
        <Menu as="div" className="relative text-left">
          {({ open }) => (
            <>
              <Menu.Button
                className="inline-flex items-center gap-2 px-4 py-1.5
                bg-[#0D243C] text-white text-sm font-medium rounded-md
                hover:bg-[#17395C] transition shadow-sm"
              >
                <LogIn size={16} />
                Login
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Menu.Button>

              <AnimatePresence>
                {open && (
                  <Menu.Items
                    as={motion.div}
                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg 
                    ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      {["admin", "hr", "employee"].map((role) => (
                        <Menu.Item key={role}>
                          {({ active }) => (
                            <button
                              onClick={() => navigate(`/login/${role}`)}
                              className={`${
                                active ? "bg-gray-100" : "bg-white"
                              } w-full flex items-center gap-3 px-4 py-2 
                              text-sm text-gray-700 transition`}
                            >
                              {roleIcons[role]}
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                )}
              </AnimatePresence>
            </>
          )}
        </Menu>
      </div>
    </motion.nav>
  );
}
