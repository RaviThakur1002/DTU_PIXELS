import React, {useState, useEffect} from 'react'
import Gallery from '../gallery/Gallery'
import authService from '../../firebase/auth/auth'

function Profile() {
  const [user, setUser] = useState(authService.auth.currentUser);

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((currentUser) => {
      if(currentUser || user) {
        return;
      }
      if (currentUser !== user) {
        setUser(currentUser);
        window.location.reload();
      }
    });

    return () => unsubscribe();
  }, [user]);

  if(!user) {
    return <Gallery />
  }
  
  return (
    <Gallery userName={user.displayName} />
  )
}

export default Profile
