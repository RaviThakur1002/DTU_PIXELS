import { get, set, getDatabase, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import UploadComponent from '../functions/UploadComponent';
import { useParams } from 'react-router-dom';
import ContestVoting from '../voting/ContestVoting';

const styles = `
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
`;

function PerContestPage() {
  const {contestId} = useParams();
  const [contestData, setContestData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('')

  const rules = [
    "Eligibility: Participants must be current students or alumni of DTU. Each participant can submit only one entry per contest.",
    "Submission Guidelines: All entries must be original and captured by the participant. Photos must be submitted in JPEG or PNG format, with a file size not exceeding 10 MB, and must adhere to the contest theme.",
    "Editing and Alterations: Basic editing (e.g., cropping, brightness/contrast adjustment) is allowed, but extensive manipulations are not permitted. Filters should not alter the integrity of the original photo.",
    "Copyright and Ownership: Participants retain full copyright of their work. By submitting an entry, participants grant DTU PIXELS the right to use the images for promotional purposes, with credit to the photographer.",
    "Judging Criteria: Entries will be judged based on creativity, relevance to the theme, and overall visual appeal. The decision of the judges is final and binding.",
    "Disqualification: Any form of plagiarism or failure to adhere to the theme or guidelines will result in disqualification.",
    "Submission Deadlines: Entries must be submitted before the contest end date and time. Late submissions will not be considered.",
    "Fair Play: Participants should not engage in unethical practices, including vote manipulation or derogatory comments about other submissions.",
    "Results and Prizes: Winners will be announced within a week after the contest ends. Prizes must be claimed within a specified period; unclaimed prizes may be forfeited.",
    "Data Privacy: Personal information collected during registration will be used solely for the purpose of the contest and will not be shared with third parties.",
    "Technical Rules: Ensure that the photo's metadata (EXIF data) is intact and includes the date and time of capture. Files should be named using the format: FirstName_LastName_ContestName."
  ];

  const setMessageWithTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const db = getDatabase();
        const contestRef = ref(db, `contests/${contestId}`);
        const snapshot = await get(contestRef);
        if(snapshot.exists()){
          setContestData(snapshot.val());
        } else {
          setError("Contest not found");
        }
      } catch (error) {
        console.error("Error fetching contest data:", error);
        setError("Failed to load contest data");
      } finally {
        setLoading(false);
      }
    }

    fetchContestData();

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [contestId]);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const auth = getAuth();
      const db = getDatabase();
      const user = auth.currentUser;
  
      if (user) {
        try {
          const userContestRef = ref(db, `users/${user.uid}/contests/${contestId}`);
          const snapshot = await get(userContestRef);
          setIsRegistered(snapshot.exists() && snapshot.val().isRegistered);
        } catch (error) {
          console.error("Error checking registration status:", error);
        }
      }
    };
  
    checkRegistrationStatus();
  }, [contestId]);

  const handleRegistration = async () => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const userContestRef = ref(db, `users/${user.uid}/contests/${contestId}`);
        await set(userContestRef, { isRegistered: true });
        setIsRegistered(true);
        setMessageWithTimer("Registered successfully!", "success");
      } catch (error) {
        console.error("Error registering for contest:", error);
        setMessageWithTimer("Registration failed. Please reload.", "error");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-600">{error}</div>;
  }

  const registrationEndTime = new Date(`${contestData.registrationEndDate}T${contestData.registrationEndTime}`);
  const contestStartTime = new Date(`${contestData.contestStartDate}T${contestData.contestStartTime}`);
  const contestEndTime = new Date(`${contestData.contestEndDate}T${contestData.contestEndTime}`);
  const votingStartTime = new Date(`${contestData.votingStartDate}T${contestData.votingStartTime}`);

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      
      <style>{styles}</style>

      {/* Message display */}
      {message && (
        <div className={`fixed top-4 right-0 mb-4 p-3 rounded-l-lg w-64 ${
          messageType === 'success' 
            ? 'bg-gradient-to-r from-green-600 to-green-800 text-white' 
            : messageType === 'error'
            ? 'bg-gradient-to-r from-red-600 to-red-800 text-white'
            : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
        } border border-solid ${
          messageType === 'success' ? 'border-green-500' : 
          messageType === 'error' ? 'border-red-500' : 'border-blue-400'
        } text-center transition-all duration-300 ease-in-out transform translate-x-0 shadow-md z-50`}
          style={{
            animation: `${message ? 'slideIn' : 'slideOut'} 0.3s ease-in-out forwards`
          }}
        >
          <p className="font-semibold">{message}</p>
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-4 mb-8">{contestData.theme} Contest</h1>
      
      <section className="mb-12 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4">Contest Timeline</h2>
        <div className="p-6 space-y-2">
          <p className="text-gray-700"><span className="font-semibold">Registration Ends:</span> {formatDateTime(registrationEndTime)}</p>
          <p className="text-gray-700"><span className="font-semibold">Contest Starts:</span> {formatDateTime(contestStartTime)}</p>
          <p className="text-gray-700"><span className="font-semibold">Contest Ends:</span> {formatDateTime(contestEndTime)}</p>
        </div>
      </section>
      
      <section className="mb-12 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4">Rules</h2>
        <ul className="p-6 space-y-4 list-decimal list-inside">
          {rules.map((rule, index) => (
            <li key={index} className="text-gray-700">{rule}</li>
          ))}
        </ul>
      </section>
      
      <section className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4">Contest Actions</h2>
        <div className="p-6">
          {currentTime < registrationEndTime && !isRegistered && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Register for the Contest</h3>
              <button 
                onClick={handleRegistration}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Register Now
              </button>
            </div>
          )}
          {isRegistered && currentTime >= contestStartTime && currentTime < contestEndTime && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Submit Your Entry</h3>
              <UploadComponent />
            </div>
          )}
          {currentTime >= votingStartTime && currentTime <contestEndTime && (
            <ContestVoting contestId={contestId} /> 
          )}
          {isRegistered && currentTime < contestStartTime && (
            <p className="text-blue-500">You are registered. The contest will start soon.</p>
          )}
          {!isRegistered && currentTime >= registrationEndTime && currentTime < contestEndTime && (
            <p className="text-red-500 italic">Registration is closed. Please wait for voting to start.</p>
          )}
          {currentTime >= contestEndTime && (
            <p className="text-gray-500 italic">The contest has ended. Thank you for participating!</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PerContestPage;
