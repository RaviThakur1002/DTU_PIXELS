import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import ContestVoting from "../voting/ContestVoting";
import UploadComponent from "../functions/UploadComponent";
import Standings from "./Standings";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";

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

function ContestActions({
  contestId,
  registrationEndTime,
  contestStartTime,
  votingStartTime,
  contestEndTime,
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showStandings, setShowStandings] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const setMessageWithTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const toggleView = (view) => {
    setShowStandings(view === "standings");
  };

  useEffect(() => {
    const auth = getAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : null;
    
    const checkUserSubmission = async (contestId, uid) => {
      const db = getDatabase();
      const userRef = ref(
        db,
        `users/${uid}/contests/${contestId}/hasSubmitted`,
      );
      const snapshot = await get(userRef);
      return snapshot.exists();
    };

    if (isRegistered && uid) {
      setLoading(true); 

      checkUserSubmission(contestId, uid).then((submitted) => {
        setHasSubmitted(submitted);
        setLoading(false);
      }).catch((error) => {
          console.error("Error checking user submission:", error);
          setLoading(false);
        })
    } else {
      setLoading(false);
    }
  }, [isRegistered, contestId]);

  useEffect(() => {

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
          const userContestRef = ref(
            db,
            `users/${user.uid}/contests/${contestId}`,
          );
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
        const userContestRef = ref(
          db,
          `users/${user.uid}/contests/${contestId}`,
        );
        await update(userContestRef, { isRegistered: !isRegistered });
        setIsRegistered(!isRegistered);
        isRegistered
          ? setMessageWithTimer("Unregistered successfully.", "error")
          : setMessageWithTimer("Registered successfully.", "success");
      } catch (error) {
        console.error("Error registering for contest:", error);
        setMessageWithTimer("Registration failed. Please reload.", "error");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="bg-white shadow-md rounded-lg overflow-hidden">
      <style>{styles}</style>

      {message && (
        <div
          className={`fixed top-4 right-0 mb-4 p-3 rounded-l-lg w-64 ${
            messageType === "success"
              ? "bg-gradient-to-r from-green-600 to-green-800 text-white"
              : messageType === "error"
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
          } border border-solid ${
            messageType === "success"
              ? "border-green-500"
              : messageType === "error"
                ? "border-red-500"
                : "border-blue-400"
          } text-center transition-all duration-300 ease-in-out transform translate-x-0 shadow-md z-50`}
          style={{
            animation: `${message ? "slideIn" : "slideOut"} 0.3s ease-in-out forwards`,
          }}
        >
          <p className="font-semibold">{message}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4">
        Contest Actions
      </h2>
      <div className="p-6">
        {currentTime < registrationEndTime && !isRegistered && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Register for the Contest
            </h3>
            <button
              onClick={handleRegistration}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Register Now
            </button>
          </div>
        )}
        {currentTime >= contestStartTime &&
          currentTime < votingStartTime &&
          (isRegistered ? (
            !hasSubmitted ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Submit Your Entry
                </h3>
                <UploadComponent />
              </div>
            ) : (
              <div>
                <p>You have submitted successfully.</p>
              </div>
            )
          ) : (
            <p className="text-red-500 italic">
              Registration is closed. Please wait for voting to start.
            </p>
          ))}
        {currentTime >= votingStartTime && currentTime < contestEndTime && (
          <ContestVoting contestId={contestId} />
        )}
        {isRegistered && currentTime < contestStartTime && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Unregister for the Contest
            </h3>
            <button
              onClick={handleRegistration}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Unregister
            </button>
          </div>
        )}

        {currentTime >= contestEndTime && (
          <div>
            <div className="mb-4 flex justify-center space-x-4">
              <button
                onClick={() => toggleView("voting")}
                className={`text-blue-500 font-bold py-2 px-4 ${!showStandings ? "border-b-2 border-blue-500" : ""}`}
              >
                Voting
              </button>
              <button
                onClick={() => toggleView("standings")}
                className={`text-blue-500 font-bold py-2 px-4 ${showStandings ? "border-b-2 border-blue-500" : ""}`}
              >
                Standings
              </button>
            </div>

            <div className="mt-4">
              {showStandings ? (
                <Standings contestId={contestId} />
              ) : (
                <ContestVoting contestId={contestId} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ContestActions;