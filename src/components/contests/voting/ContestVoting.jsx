import React, { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../../../config/conf.js";
import VoteService from "../../../firebase/services/VoteService.js";
import LikeService from "../../../firebase/services/LikeService.js";
import UploadService from "../../../firebase/services/UplaodService.js";
import VoteCard from "./VoteCard.jsx";
import VotePopup from "./VotePopup.jsx";
import MessagePopup from "./MessagePopup.jsx";
import "./ContestVoting.css";
import Pagination from "../../Utilities/Pagination.jsx";

const ContestVoting = () => {
  const [entries, setEntries] = useState([]);
  const [likedPhotoId, setLikedPhotoId] = useState(null);
  const [votedPhotoId, setVotedPhotoId] = useState(null);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [contestId, setContestId] = useState(null);
  const [contestEndDateTime, setContestEndDateTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 12;

  useEffect(() => {
    const contestIdFromService = UploadService.contestId;
    if (contestIdFromService) {
      setContestId(contestIdFromService);
    } else {
      console.error("Contest ID is not set in UploadService.");
    }
  }, []);

  useEffect(() => {
    if (contestId) {
      const database = getDatabase(app);
      const contestRef = ref(database, `contests/${contestId}`);

      const unsubscribe = onValue(contestRef, (snapshot) => {
        const contestData = snapshot.val();
        if (contestData) {
          const {
            contestEndDate,
            contestEndTime,
            entries: entriesData,
          } = contestData;
          const endDateTime = new Date(`${contestEndDate}T${contestEndTime}`);
          setContestEndDateTime(endDateTime);

          if (entriesData) {
            const entriesArray = Object.entries(entriesData).map(
              ([key, value]) => ({
                id: key,
                ...value,
              }),
            );
            entriesArray.sort((a, b) => {
              if (a.isWinner && !b.isWinner) return -1;
              if (!a.isWinner && b.isWinner) return 1;
              return b.voteCount - a.voteCount || b.timestamp - a.timestamp;
            });
            setEntries(entriesArray);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [contestId]);

  useEffect(() => {
    if (contestId) {
      const fetchUserVoteStatus = async () => {
        try {
          const likedPhoto = await LikeService.getLikedPhoto(contestId);
          setLikedPhotoId(likedPhoto);

          const votedPhoto = await VoteService.getVotedPhoto(contestId);
          setVotedPhotoId(votedPhoto);
        } catch (error) {
          console.error("Error fetching user vote status:", error);
        }
      };

      fetchUserVoteStatus();
    }
  }, [contestId]);

  const isContestEnded = useCallback(() => {
    if (!contestEndDateTime) return false;
    return new Date() > contestEndDateTime;
  }, [contestEndDateTime]);

  const handleLike = async (photoId) => {
    if (isContestEnded()) {
      setMessage("The contest has ended. Likes are no longer allowed.");
      return;
    }

    if (votedPhotoId) {
      setMessage("You've already voted and can't change your like.");
      return;
    }

    try {
      await LikeService.likePhoto(contestId, photoId);
      setLikedPhotoId((prevLikedPhotoId) =>
        prevLikedPhotoId === photoId ? null : photoId,
      );
    } catch (error) {
      console.error("Error liking photo:", error);
      setMessage("Error liking photo. Please try again.");
    }
  };

  const handleVote = async () => {
    if (isContestEnded()) {
      setMessage("The contest has ended. Voting is no longer allowed.");
      return;
    }

    if (!likedPhotoId) {
      setMessage("Please like a photo before voting.");
      return;
    }

    try {
      await VoteService.voteForPhoto(contestId, likedPhotoId);
      setVotedPhotoId(likedPhotoId);
      setMessage("Your vote has been recorded!");
    } catch (error) {
      console.error("Error voting for photo:", error);
      setMessage(error.message);
    }
  };

  const openPopup = useCallback(
    (entry) => {
      const index = entries.findIndex((e) => e.id === entry.id);
      setCurrentEntryIndex(index);
      document.body.style.overflow = "hidden";
    },
    [entries],
  );

  const closePopup = useCallback(() => {
    setCurrentEntryIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentEntryIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : entries.length - 1,
    );
  }, [entries]);

  const handleNext = useCallback(() => {
    setCurrentEntryIndex((prevIndex) =>
      prevIndex < entries.length - 1 ? prevIndex + 1 : 0,
    );
  }, [entries]);

  const pageCount = Math.ceil(entries.length / entriesPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedEntries = entries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage,
  );

  if (!contestId) {
    return <div>Loading contest...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Contest Voting</h2>

      <div className="contest-grid grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayedEntries.map((entry) => (
          <VoteCard
            key={entry.id}
            entry={entry}
            isLiked={entry.id === likedPhotoId}
            onLike={() => handleLike(entry.id)}
            onClick={() => openPopup(entry)}
            showLikeButton={!isContestEnded()}
          />
        ))}
      </div>

      <Pagination
        pageCount={pageCount}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      {!isContestEnded() && (
        <button
          className={`mt-4 px-4 py-2 rounded transition-colors duration-300 ${
            votedPhotoId
              ? "bg-green-500 text-white"
              : likedPhotoId
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-400 text-white cursor-not-allowed"
          }`}
          onClick={handleVote}
          disabled={votedPhotoId !== null || !likedPhotoId}
        >
          {votedPhotoId
            ? "Voted"
            : likedPhotoId
              ? "Confirm Vote"
              : "Like a photo to vote"}
        </button>
      )}
      {currentEntryIndex !== null && (
        <VotePopup
          entries={entries}
          currentIndex={currentEntryIndex}
          onClose={closePopup}
          isLiked={entries[currentEntryIndex].id === likedPhotoId}
          onLike={handleLike}
          onPrevious={handlePrevious}
          onNext={handleNext}
          showLikeButton={!isContestEnded()}
        />
      )}
      <MessagePopup message={message} setMessage={setMessage} />
    </div>
  );
};

export default ContestVoting;
