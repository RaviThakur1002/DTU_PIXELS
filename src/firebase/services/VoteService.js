import { getDatabase, ref, runTransaction } from "firebase/database";

import { getAuth } from "firebase/auth";
import app from "../../config/conf.js";

export class VoteService {
  database;
  auth;

  constructor() {
    this.database = getDatabase(app);
    this.auth = getAuth(app);
  }

  async voteForPhoto(contestId, photoId) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userContestRef = ref(
        this.database,
        `users/${users.uid}/contests/${contestId}`,
      );
      const photoRef = ref(
        this.database,
        `contests/${contestId}/entries/${photoId}`,
      );
      await runTransaction(userContestRef, (userData) => {
        if (userData === null) {
          return { votedPhoto: photoId };
        }

        if (userData.votedPhoto) {
          throw new Error("You have already voted in the contest");
        }

        userData.votedPhoto = photoId;
        return userData;
      });

      await runTransaction(photoRef, (photoData) => {
        if (photoData === null) return null;

        if (!photoData.voteCount) {
          photoData.voteCount = 0;
        }

        photoData.voteCount += 1;
        return photoData;
      });
      console.log("Vote operation successful");
    } catch (error) {
      console.error("operation failed:", error);
      throw error;
    }
  }
}

export default new VoteService();
