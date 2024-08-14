import React, { useState, useEffect } from "react";
import Gallery from "../gallery/Gallery";
import authService from "../../firebase/auth/auth";
import { Navigate } from "react-router-dom";
import roleService from "../../firebase/roleAssigning/RoleService";
import { GalleryProvider } from "../contexts/GalleryContext.jsx";

function Profile() {
  const [user, setUser] = useState(authService.auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const role = await roleService.getRole();
      console.log(role);
      setIsAdmin(role === "admin");
    };
    checkAdminStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAdmin) {
      try {
        await roleService.setRole(userId, "admin");
      } catch (error) {
        // Handle error
      }
    } else {
      // Handle lack of permission
    }
  };

  if (isLoading) {
    return <div className="text-gray-200 text-center">Loading...</div>; // Updated for dark theme
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
   <div className="w-full mx-auto p-4 bg-[#101010] text-white min-h-screen">
      <GalleryProvider>
        <Gallery userName={user.displayName} isProfile={true} />
      </GalleryProvider>
    </div>
  );
}

export default Profile;

