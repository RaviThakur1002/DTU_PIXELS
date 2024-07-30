import { getDatabase, ref, runTransaction, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../config/conf.js";

class VoteService {
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
        `users/${user.uid}/contests/${contestId}`,
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
          throw new Error("You have already voted in this contest");
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
      console.error("Vote operation failed:", error);
      throw error;
    }
  }

  async getVotedPhoto(contestId) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userContestRef = ref(
        this.database,
        `users/${user.uid}/contests/${contestId}`,
      );
      const snapshot = await get(userContestRef);
      const userData = snapshot.val();

      return userData ? userData.votedPhoto : null;
    } catch (error) {
      console.error("Get voted photo operation failed:", error);
      throw error;
    }
  }
}

export default new VoteService();
