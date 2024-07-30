import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../../../config/conf.js";
import VoteService from "../../../firebase/services/VoteService.js";
import LikeService from "../../../firebase/services/LikeService.js";
import ContestServiceInstance from "../../../firebase/contestServices/ContestService.js";
import VoteCard from "./VoteCard.jsx";
import VotePopup from "./VotePopup.jsx";

const ContestVoting = () => {
    const [currentContest, setCurrentContest] = useState(null);
    const [entries, setEntries] = useState([]);
    const [likedPhotoId, setLikedPhotoId] = useState(null);
    const [votedPhotoId, setVotedPhotoId] = useState(null);
    const [popupEntry, setPopupEntry] = useState(null);

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
        try {
            await LikeService.likePhoto(currentContest.id, photoId);
            setLikedPhotoId(photoId);
        } catch (error) {
            console.error("Error liking photo:", error);
        }
    };

    const handleVote = async () => {
        if (!likedPhotoId) {
            alert("Please like a photo before voting.");
            return;
        }

        try {
            await VoteService.voteForPhoto(currentContest.id, likedPhotoId);
            setVotedPhotoId(likedPhotoId);
        } catch (error) {
            console.error("Error voting for photo:", error);
            alert(error.message);
        }
    };

    const openPopup = (entry) => {
        setPopupEntry(entry);
    };

    const closePopup = () => {
        setPopupEntry(null);
    };

    if (!currentContest) {
        return <div>Loading contest...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">
                Contest Voting: {currentContest.theme}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                onClick={handleVote}
                disabled={votedPhotoId !== null}
            >
                {votedPhotoId ? "Voted" : "Vote"}
            </button>
            {popupEntry && (
                <VotePopup
                    entry={popupEntry}
                    onClose={closePopup}
                    isLiked={popupEntry.id === likedPhotoId}
                    onLike={() => handleLike(popupEntry.id)}
                />
            )}
        </div>
    );
};

export default ContestVoting;
