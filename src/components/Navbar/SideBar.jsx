// Sidebar.jsx
import React from "react";
import { X, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import CopyUID from "./CopyUID";
import CreateContest from "../Admin/CreateContest";
import authService from "../../firebase/auth/auth";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  user,
  isAdmin,
  menuItems,
  setIsPromotionPopupOpen,
}) => {
  const sidebarStyle = {
    position: "fixed",
    top: 0,
    right: isSidebarOpen ? "0" : "-100%",
    width: "70%",
    maxWidth: "320px",
    height: "100vh",
    backgroundColor: "#171717",
    boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
    transition: "right 0.3s ease-in-out, opacity 0.3s ease-in-out",
    zIndex: 1000,
    overflowY: "auto",
    opacity: isSidebarOpen ? 1 : 0,
  };

  return (
    <div style={sidebarStyle} className="lg:hidden p-5 pb-0 flex flex-col">
      {/* Sidebar header */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center space-x-2">
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
                fill="white"
              />
            </svg>
          </span>
          <span className="font-bold text-lg text-white">DTU PIXELS</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* User profile section */}
      {user && (
        <div className="mb-6 p-4 bg-[#1f1f1f] rounded-lg shadow-lg">
          <img
            className="rounded-full w-20 h-20 mb-3 mx-auto border-2 border-[#c638ab]"
            src={user.photoURL}
            alt="User profile"
          />
          <h3 className="text-xl font-bold text-white text-center mb-1">
            {user.displayName}
          </h3>
          {isAdmin && (
            <span className="block text-sm font-semibold text-purple-400 text-center mb-2">
              Admin
            </span>
          )}
          <CopyUID />
        </div>
      )}

      {/* Navigation items */}
      <nav className="space-y-1 mb-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 text-md font-medium text-white hover:bg-gray-600 hover:text-fuchsia-500 rounded-md transition-all duration-200"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
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
      </nav>

      {/* Sign in/out button */}
      <div className="sticky bottom-0 bg-[#171717] p-5 pb-20">
        {user ? (
          <button
            onClick={() => {
              authService.signOutUser();
              toggleSidebar();
            }}
            className="w-full mt-2 px-1 py-2 text-sm font-medium text-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="white"
              >
                <path
                  d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
                  fill="currentColor"
                />
              </svg>
              <span>Sign Out</span>
            </div>
          </button>
        ) : (
          <button
            className={`flex items-center justify-center mt-1 px-3 py-2 
              border border-[#c638ab] rounded-md shadow-sm hover:bg-gray-200  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-300`}
            onClick={() => {
              authService.googleSignIn();
              toggleSidebar();
            }}
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
    </div>
  );
};

export default Sidebar;
