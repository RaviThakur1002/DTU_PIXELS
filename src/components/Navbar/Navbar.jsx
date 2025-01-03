// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import authService from "../../firebase/auth/auth";
import roleService from "../../firebase/roleAssigning/RoleService";
import AdminPromotionPopup from "../Admin/AdminPromotionPopup";
import SideBar from "./SideBar";
import { ChevronRight } from "lucide-react";
import CopyUID from "./CopyUID";
import CreateContest from "../Admin/CreateContest";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPromotionPopupOpen, setIsPromotionPopupOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged(
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          try {
            const role = await roleService.getRole();
            setIsAdmin(role === "admin");
          } catch (error) {
            console.error(error);
          }
        } else {
          setIsAdmin(false);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsFloating(scrollPosition > 50); // Adjust this value as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "gallery" },
    { name: "Contest", href: "contest" },
    { name: "Hall of Fame", href: "winners" },
  ];

  if (user) {
    menuItems.push({ name: "Submissions", href: "submissions" });
  }

  return (
    <div
      className={`sticky z-50 top-0 w-full p-1 ${isFloating ? "bg-transparent" : "bg-black"}`}
    >
      <div
        className={`mx-auto flex justify-between max-w-7xl transition-all duration-300 ${isFloating
            ? "bg-[#000000] text-white rounded-full shadow-lg mt-2 px-8 py-1 border-2 border-[#cba6f7]"
            : "bg-black text-white px-2"
          }`}
      >
        {/* Logo and brand name */}

        <div className="inline-flex  items-center space-x-2">
          <span>
            <svg
              width="30"
              height="30"
              viewBox="0 0 50 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                fill="gray"
              />
            </svg>
          </span>
          <NavLink to={"/"}>
            <span
              className={`font-bold bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] text-transparent bg-clip-text `}
            >
              DTU PIXELS
            </span>
          </NavLink>
        </div>

        {/* Desktop menu */}
        <div className="hidden grow items-start lg:flex ">
          <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name} className="relative group">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `inline-flex items-center text-md font-semibold ${isActive
                      ? "text-fuchsia-600"
                      : "text-white"
                    } hover:text-purple-600 py-2`
                  }
                >
                  <span className="relative">
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* User dropdown (desktop) */}
        <div className="hidden space-x-2 lg:block">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center focus:outline-none gap-2 p-1 ${isFloating ? "text-gray-900" : "text-white"
                  }`}
              >
                <img
                  className="rounded-full w-8 h-8"
                  src={user.photoURL}
                  alt="User profile"
                />
                <ChevronDown
                  className={`h-4 w-4 ml-1 text-white`}
                />
              </button>
              {dropdownOpen && (
                <div
                  className={`absolute z-50 right-0 mt-2 w-48 rounded-md shadow-xl py-1 bg-[#1f1f1f]`}
                >
                  <div className="px-4 py-3 border-gray-700 flex flex-col items-center justify-center">
                    <h3 className="text-md font-bold text-white mb-1">
                      {user.displayName}
                    </h3>
                    {isAdmin && (
                      <span className="text-xs font-semibold text-purple-400">
                        Admin
                      </span>
                    )}
                  </div>
                  <CopyUID className="border-t border-gray-700 my-1" />{" "}
                  <div className="border-t border-gray-700 my-1"></div>
                  {isAdmin && (
                    <>
                      <CreateContest />
                      <button
                        className="flex border-none outline-none items-center gap-3 px-4 py-3 text-md font-medium text-white hover:bg-gray-600 hover:text-fuchsia-500 rounded-md transition-all duration-200 w-full text-left"
                        onClick={() => {
                          setIsPromotionPopupOpen(true);
                          toggleSidebar();
                        }}
                      >
                        <ChevronRight className="h-5 w-5" />
                        <span>Make Admin</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={authService.signOutUser}
                    className="w-full mt-2 px-1 py-2 text-sm font-medium text-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="white"
                      >
                        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                      </svg>
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className={`flex items-center justify-center px-3 py-2 ${isFloating ? "bg-white text-black" : "bg-white text-gray-900"
                } border border-[#c638ab] rounded-md shadow-sm hover:bg-gray-200  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-300`}
              onClick={authService.googleSignIn}
            >
              <svg
                className="w-4 h-5 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M6.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </button>
          )}
        </div>

        <div className="lg:hidden">
          <Menu
            onClick={toggleSidebar}
            className={`h-6 w-6 mt-1 cursor-pointer text-white`}
          />
        </div>

        {/* Mobile Sidebar */}
        <SideBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          isAdmin={isAdmin}
          menuItems={menuItems}
          setIsPromotionPopupOpen={setIsPromotionPopupOpen}
        />
      </div>

      <AdminPromotionPopup
        isOpen={isPromotionPopupOpen}
        onClose={() => setIsPromotionPopupOpen(false)}
      />
    </div>
  );
};

export default Navbar;
