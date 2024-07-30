import React, { useState, useEffect } from 'react';
import Gallery from '../gallery/Gallery';
import authService from '../../firebase/auth/auth';
import { Navigate } from 'react-router-dom';
import roleService from '../../firebase/roleAssigning/RoleService';

function Profile() {
  const [user, setUser] = useState(authService.auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
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
      const role = await roleService.getRole()
      console.log(role)
      setIsAdmin(role === 'admin')
    }
    checkAdminStatus();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isAdmin){
      try{
        await roleService.setRole(userId, 'admin');
      }
      catch(error){
        // setMessage(`Error: ${error.message}`);
      }
    }
    else{
      // setMessage('You do not have permission to add admins.');
    }
  }

  if (isLoading) {
    return <div>Loading...</div>; //  Loading indicator while checking the auth state
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      {isAdmin ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Promote User to Admin</h2>
          <div className="mb-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter User ID"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Promote
          </button>
        </form>
      ) : null}
      <Gallery userName={user.displayName} />
    </div>
  )
}

export default Profile;
