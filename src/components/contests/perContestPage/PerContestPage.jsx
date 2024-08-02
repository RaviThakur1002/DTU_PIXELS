import { get, set, getDatabase, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import UploadComponent from '../functions/UploadComponent';

function PerContestPage({contestId}) {
  const [contestData, setContestData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchContestData = async () => {
      const db = getDatabase();
      const contestRef = ref(db, `contests/${contestId}`);
      const snapshot = await get(contestRef);

      if(snapshot.exists()){
        setLoading(false);
        setContestData(snapshot.val());
      }
    }

    fetchContestData();

    const intervalId = setInterval(()=> {
      setCurrentTime(new Date());
    }, 6000);

    return ()=> clearInterval(intervalId)
  }, [contestId])

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const auth = getAuth();
      const db = getDatabase();
      const user = auth.currentUser;
  
      if (user) {
        const userContestRef = ref(db, `users/${user.uid}/contests/${contestId}`);
        const snapshot = await get(userContestRef);
  
        if (snapshot.exists()) {
          setIsRegistered(snapshot.val().isRegistered);
        }
      }
    };
  
    checkRegistrationStatus();
  }, [contestId]);

  const handleRegistration = async (contestId) => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const userContestRef = ref(db, `users/${user.uid}/contests/${contestId}`);
      await set(userContestRef, {
        isRegistered: true,
        hasSubmitted: false, // or you can omit this if not relevant at registration
        submittedPhotoId: null // or initialize it as needed
      });
      setIsRegistered(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const registrationEndTime = new Date(contestData.registrationEnd);
  const contestStartTime = new Date(contestData.contestStart);
  const contestEndTime = new Date(contestData.contestEnd);

  return (
    <div>
      <h1>{contestData.theme} Contest</h1>
      <section>
        <h2>Rules</h2>
        <p>{contestData.rules}</p>
      </section>

      <section>
        {currentTime < registrationEndTime && !isRegistered && (
          <form>
            <h3>Register for the Contest</h3>
            <button onClick={() => {handleRegistration}}>
              Register
            </button>
          </form>
        )}

        {currentTime >= registrationEndTime && currentTime < contestEndTime && isRegistered && (
          <UploadComponent />
        )}

        {currentTime >= registrationEndTime && !isRegistered && (
          <p>Registration is closed. You cannot participate in this contest.</p>
        )}

        {currentTime >= contestEndTime && (
          <p>The contest has ended. Thank you for participating!</p>
        )}
      </section>
    </div>
  );
}

export default PerContestPage
