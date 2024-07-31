import React, { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../../../config/conf.js";
import VoteService from "../../../firebase/services/VoteService.js";
import LikeService from "../../../firebase/services/LikeService.js";
import ContestServiceInstance from "../../../firebase/contestServices/ContestService.js";
import VoteCard from "./VoteCard.jsx";
import VotePopup from "./VotePopup.jsx";
import MessagePopup from "./MessagePopup.jsx";

const ContestVoting = () => {
    const [currentContest, setCurrentContest] = useState(null);
    const [entries, setEntries] = useState([]);
    const [likedPhotoId, setLikedPhotoId] = useState(null);
    const [votedPhotoId, setVotedPhotoId] = useState(null);
    const [popupEntry, setPopupEntry] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCurrentContest = async () => {
            const contest = await ContestServiceInstance.getCurrentContest();
            setCurrentContest(contest);
        };

        fetchCurrentContest();
    }, []);

    useEffect(() => {
        if (currentContest) {
            const database = getDatabase(app);
            const entriesRef = ref(database, `contests/${currentContest.id}/entries`);

            const unsubscribe = onValue(entriesRef, (snapshot) => {
                const entriesData = snapshot.val();
                if (entriesData) {
                    const entriesArray = Object.entries(entriesData).map(
                        ([key, value]) => ({
                            id: key,
                            ...value,
                        }),
                    );
                    setEntries(entriesArray);
                }
            });

            return () => unsubscribe();
        }
    }, [currentContest]);

    useEffect(() => {
        if (currentContest) {
            const fetchUserVoteStatus = async () => {
                try {
                    const likedPhoto = await LikeService.getLikedPhoto(currentContest.id);
                    setLikedPhotoId(likedPhoto);

                    const votedPhoto = await VoteService.getVotedPhoto(currentContest.id);
                    setVotedPhotoId(votedPhoto);
                } catch (error) {
                    console.error("Error fetching user vote status:", error);
                }
            };

            fetchUserVoteStatus();
        }
    }, [currentContest]);

    const handleLike = async (photoId) => {
        if (votedPhotoId) {
            setMessage("You've already voted and can't change your like.");
            return;
        }

        try {
            await LikeService.likePhoto(currentContest.id, photoId);
            setLikedPhotoId((prevLikedPhotoId) =>
                prevLikedPhotoId === photoId ? null : photoId,
            );
        } catch (error) {
            console.error("Error liking photo:", error);
            setMessage("Error liking photo. Please try again.");
        }
    };

    const handleVote = async () => {
        if (!likedPhotoId) {
            setMessage("Please like a photo before voting.");
            return;
        }

        try {
            await VoteService.voteForPhoto(currentContest.id, likedPhotoId);
            setVotedPhotoId(likedPhotoId);
            setMessage("Your vote has been recorded!");
        } catch (error) {
            console.error("Error voting for photo:", error);
            setMessage(error.message);
        }
    };

    const openPopup = useCallback((entry) => {
        setPopupEntry(entry);
        document.body.style.overflow = 'hidden';
    }, []);

    const closePopup = useCallback(() => {
        setPopupEntry(null);
        document.body.style.overflow = 'auto';
    }, []);

    if (!currentContest) {
        return <div>Loading contest...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">
                Contest Voting: {currentContest.theme}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {entries.map((entry) => (
                    <VoteCard
                        key={entry.id}
                        entry={entry}
                        isLiked={entry.id === likedPhotoId}
                        onLike={() => handleLike(entry.id)}
                        onClick={() => openPopup(entry)}
                    />
                ))}
            </div>
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
            {popupEntry && (
                <VotePopup
                    entry={popupEntry}
                    onClose={closePopup}
                    isLiked={popupEntry.id === likedPhotoId}
                    onLike={() => handleLike(popupEntry.id)}
                />
            )}
            <MessagePopup message={message} setMessage={setMessage} />
        </div>
    );
};

export default ContestVoting;
