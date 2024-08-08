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
        // setMessage(`Error: ${error.message}`);
      }
    } else {
      // setMessage('You do not have permission to add admins.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; //  Loading indicator while checking the auth state
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      <GalleryProvider>
        <Gallery userName={user.displayName} />
      </GalleryProvider>
    </div>
  );
}

export default Profile;
