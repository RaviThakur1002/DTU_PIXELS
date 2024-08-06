import { get, set, getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import UploadComponent from "../functions/UploadComponent";
import { useParams, useNavigate } from "react-router-dom";
import ContestVoting from "../voting/ContestVoting";
import UplaodService from "../../../firebase/services/UplaodService";
import Standings from "./Standings";
import LoadingSpinner from "../../LoadingSpinner";
import Countdown from "./Countdown";

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
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contestData, setContestData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showStandings, setShowStandings] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);

  const rules = [
    "Eligibility: Each participant can submit only one entry per contest.",
    "Submission Guidelines: All entries must be original and captured by the participant. Photos must be submitted in JPEG or PNG format, with a file size not exceeding 20 MB, and must adhere to the contest theme.",
    "Editing and Alterations: Basic editing (e.g., cropping, brightness/contrast adjustment) is allowed, but extensive manipulations are not permitted. Filters should not alter the integrity of the original photo.",
    "Copyright and Ownership: Participants retain full copyright of their work. By submitting an entry, participants grant DTU PIXELS the right to use the images for promotional purposes, with credit to the photographer.",
    "Judging Criteria: Entries will be judged based on creativity, relevance to the theme, and overall visual appeal. The decision will be done on the basis of most votes.",
    "Disqualification: Any form of plagiarism or failure to adhere to the theme or guidelines will result in disqualification.",
    "Submission Deadlines: Entries must be submitted before the contest end date and time. Late submissions will not be considered.",
    "Fair Play: Participants should not engage in unethical practices, including vote manipulation or derogatory comments about other submissions.",
    "Data Privacy: Personal information collected during registration will be used solely for the purpose of the contest and will not be shared with third parties.",
  ];

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
    const fetchContestData = async () => {
      try {
        const db = getDatabase();
        const contestRef = ref(db, `contests/${contestId}`);
        const snapshot = await get(contestRef);
        if (snapshot.exists()) {
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
    };

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
  
  //for date checking 
  useEffect(() => {
    if (contestData) {
      const registrationEndTime = new Date(
        `${contestData.registrationEndDate}T${contestData.registrationEndTime}`,
      );
      const contestStartTime = new Date(
        `${contestData.contestStartDate}T${contestData.contestStartTime}`,
      );
      const contestEndTime = new Date(
        `${contestData.contestEndDate}T${contestData.contestEndTime}`,
      );
      const votingStartTime = new Date(
        `${contestData.votingStartDate}T${contestData.votingStartTime}`,
      );

      const timeEvents = [
        { time: registrationEndTime, name: "Registration End" },
        { time: contestStartTime, name: "Contest Start" },
        { time: contestEndTime, name: "Contest End" },
        { time: votingStartTime, name: "Voting Start" },
      ];

      const now = new Date();

      // Find the next upcoming event
      const nextEvent = timeEvents.find((event) => event.time > now);

      if (nextEvent) {
        const timeUntilNextEvent = nextEvent.time - now;
        const timeoutId = setTimeout(() => {
          window.location.reload();
        }, timeUntilNextEvent);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [contestData, currentTime]);
  
  //for countdown
  useEffect(() => {
    if (contestData) {
      const contestStartTime = new Date(
        `${contestData.contestStartDate}T${contestData.contestStartTime}`,
      );
      const votingStartTime = new Date(
        `${contestData.votingStartDate}T${contestData.votingStartTime}`,
      );
      const contestEndTime = new Date(
        `${contestData.contestEndDate}T${contestData.contestEndTime}`,
      );

      const determineCurrentStage = () => {
        const now = new Date();
        if (now < contestStartTime) {
          setCurrentStage('contestStart');
        } else if (now < votingStartTime) {
          setCurrentStage('votingStart');
        } else if (now < contestEndTime) {
          setCurrentStage('contestEnd');
        } else {
          setCurrentStage('ended');
        }
      };

      determineCurrentStage();
      const intervalId = setInterval(determineCurrentStage, 1000);

      return () => clearInterval(intervalId);
    }
  }, [contestData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        {error}
      </div>
    );
  }

  const registrationEndTime = new Date(
    `${contestData.registrationEndDate}T${contestData.registrationEndTime}`,
  );
  const contestStartTime = new Date(
    `${contestData.contestStartDate}T${contestData.contestStartTime}`,
  );
  const contestEndTime = new Date(
    `${contestData.contestEndDate}T${contestData.contestEndTime}`,
  );
  const votingStartTime = new Date(
    `${contestData.votingStartDate}T${contestData.votingStartTime}`,
  );

  UplaodService.setContestId(contestId);
  
  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderCountdown = () => {
    switch (currentStage) {
      case 'contestStart':
        return (
          <div>
            <p className="font-semibold">Contest Starts In:</p>
            <Countdown targetDate={contestStartTime} />
          </div>
        );
      case 'votingStart':
        return (
          <div>
            <p className="font-semibold">Voting Starts In:</p>
            <Countdown targetDate={votingStartTime} />
          </div>
        );
      case 'contestEnd':
        return (
          <div>
            <p className="font-semibold">Contest Ends In:</p>
            <Countdown targetDate={contestEndTime} />
          </div>
        );
      case 'ended':
        return <p className="font-semibold">Contest has ended</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-6 font-sans">
      <style>{styles}</style>

      {/* Message display */}
      {message && (
        <div
          className={`fixed top-4 right-0 mb-4 p-3 rounded-l-lg w-64 ${messageType === "success"
              ? "bg-gradient-to-r from-green-600 to-green-800 text-white"
              : messageType === "error"
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
            } border border-solid ${messageType === "success"
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

      <button
        onClick={() => navigate("/contest")}
        className="flex items-center text-blue-500 font-bold mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Go Back to Contests
      </button>

      <h1 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-4 mb-8">
        Contest No- {contestId}, Theme- {contestData.theme}
      </h1>

      <section className="mb-12 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4">
          Contest Timeline
        </h2>
        <div className="p-6 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Registration Ends:</span>{" "}
            {formatDateTime(registrationEndTime)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Contest Starts:</span>{" "}
            {formatDateTime(contestStartTime)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Contest Ends:</span>{" "}
            {formatDateTime(contestEndTime)}
          </p>
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            {renderCountdown()}
          </div>
        </div>
      </section>

      { currentTime < votingStartTime && ( 
        <section className="mb-12 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4">
            Rules
          </h2>
          <ul className="p-6 space-y-4 list-decimal list-inside">
            {rules.map((rule, index) => (
              <li key={index} className="text-gray-700">
                {rule}
              </li>
            ))}
          </ul>
        </section>  )}

      <section className="bg-white shadow-md rounded-lg overflow-hidden">
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
              contestData.hasSubmitted ? (
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
                Register for the Contest
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
    </div>
  );
}

export default PerContestPage;
