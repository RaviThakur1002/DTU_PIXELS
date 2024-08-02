import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import roleService from '../../../firebase/roleAssigning/RoleService'
import { getAuth } from 'firebase/auth'
import ContestPage from '../contestPage/ContestPage'

function Temp() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true);
  const auth = getAuth()

  useEffect(()=> {
    const unregisterAuthObserver = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const role = await roleService.getRole();
          console.log(role);
          setIsAdmin(role === 'admin');
        } catch (error) {
          console.error(error);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }); 

    return () => unregisterAuthObserver(); 
  }, [auth])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAdmin && (
        <NavLink to="createcontest">
          <div className='bg-gray-800 flex justify-center '>
            <button className="m-3 hover:bg-gray-700 text-white">Create a Contest</button>
          </div>
        </NavLink>
      )}
      <ContestPage />
    </div>
  )
}

export default  Temp
