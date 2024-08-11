import { get, set, getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UplaodService from "../../../firebase/services/UplaodService";
import LoadingSpinner from "../../LoadingSpinner";
import Countdown from "./Countdown";
import RemoveContest from "./RemoveContest";
import ContestActions from "./ContestActions";

function PerContestPage() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contestData, setContestData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          setCurrentStage("contestStart");
        } else if (now < votingStartTime) {
          setCurrentStage("votingStart");
        } else if (now < contestEndTime) {
          setCurrentStage("contestEnd");
        } else {
          setCurrentStage("ended");
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
      case "contestStart":
        return (
          <div>
            <p className="font-semibold text-white">Contest Starts In:</p>
            <Countdown targetDate={contestStartTime} />
            <br />
            <p className="text-gray-300">Please Register to take part in the Contest.</p>
          </div>
        );
      case "votingStart":
        return (
          <div>
            <p className="font-semibold text-white">Voting Starts In:</p>
            <Countdown targetDate={votingStartTime} />
            <br />
            <p className="text-gray-300">Contestants should Upload their Entries</p>
          </div>
        );
      case "contestEnd":
        return (
          <div>
            <p className="font-semibold text-white">Contest Ends In:</p>
            <Countdown targetDate={contestEndTime} />
            <br />
            <p className="text-gray-300">Voting has started. Please feel free to vote.</p>
          </div>
        );
      case "ended":
        return <p className="font-semibold text-white">Contest has ended</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-6 font-sans bg-gray-900 text-white">
      <div className="flex justify-between">
        <button
          onClick={() => navigate("/contest")}
          className="flex items-center text-orange-500 font-bold mb-4"
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
        {currentTime > contestEndTime ? null : (
          <RemoveContest contestId={contestId} />
        )}
      </div>

      <h1 className="text-4xl font-bold text-white border-b-2 border-gray-700 pb-4 mb-8">
        Contest No- {contestId}, Theme- {contestData.theme}
      </h1>

      <section className="mb-12 bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold text-white bg-orange-500 p-4">
          Contest Timeline
        </h2>
        <div className="p-6 space-y-2">
          <p className="text-gray-300">
            <span className="font-semibold text-white">Registration Ends:</span>{" "}
            {formatDateTime(registrationEndTime)}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Contest Starts:</span>{" "}
            {formatDateTime(contestStartTime)}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Voting Starts:</span>{" "}
            {formatDateTime(votingStartTime)}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Contest Ends:</span>{" "}
            {formatDateTime(contestEndTime)}
          </p>
          <div className="mt-6 bg-gray-700 p-4 rounded-lg">
            {renderCountdown()}
          </div>
        </div>
      </section>

      {currentTime < votingStartTime && (
        <section className="mb-12 bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <h2 className="text-2xl font-semibold text-white bg-orange-500 p-4">
            Rules
          </h2>
          <ul className="p-6 space-y-4 list-decimal list-inside text-gray-300">
            {rules.map((rule, index) => (
              <li key={index}>
                {rule}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContestActions
        contestId={contestId}
        registrationEndTime={registrationEndTime}
        contestStartTime={contestStartTime}
        contestEndTime={contestEndTime}
        votingStartTime={votingStartTime}
      />
    </div>
  );
}

export default PerContestPage;
