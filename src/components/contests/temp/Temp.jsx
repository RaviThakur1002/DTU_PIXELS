import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import roleService from '../../../firebase/roleAssigning/RoleService';
import ContestPage from '../contestPage/ContestPage';
import LoadingSpinner from '../../LoadingSpinner.jsx'; 
function Temp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const contestQuotes = [
    "Preparing the contest arena... May the odds be ever in your favor!",
    "Polishing the trophies... They're so shiny, you might need sunglasses!",
    "Rolling out the red carpet... Or was it the green carpet? Blue?",
    "Tuning the applause-o-meter... Get ready to make some noise!",
    "Mark your calendars! Exciting contests are just around the corner.",
    "Stay tuned! The next big contest is coming soon.",
    "Prepare yourself! Upcoming contests will be announced shortly.",
    "Anticipate the thrill! New contests are on their way.",
    "The battle is on! Participate in the current contest now.",
    "Join the action! Our current contest is live.",
    "Get involved! The contest arena is open for entries.",
    "Dive in! Compete in the ongoing contest and showcase your talent.",
  ];

  const randomQuote = useMemo(() => {
    return contestQuotes[Math.floor(Math.random() * contestQuotes.length)];
  }, []);

  useEffect(() => {
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
  }, [auth]);

  if (loading) {
    return (
      <LoadingSpinner quote={randomQuote} />
    );
  }

  return (
    <div>
      {isAdmin && (
        <NavLink to="createcontest">
          <div className='bg-gray-800 flex justify-center'>
            <button className="m-3 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out">
              Create a Contest
            </button>
          </div>
        </NavLink>
      )}
      <ContestPage />
    </div>
  );
}

export default Temp;

