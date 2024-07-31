import { getDatabase, ref, runTransaction, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../config/conf.js";

class VoteService {
  constructor() {
    this.database = getDatabase(app);
    this.auth = getAuth(app);
  }

  async voteForPhoto(contestId, photoId) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const userVoteRef = ref(this.database, `users/${user.uid}/contests/${contestId}/vote`);
    const photoRef = ref(this.database, `contests/${contestId}/entries/${photoId}`);

    await runTransaction(userVoteRef, (currentVote) => {
      if (currentVote !== null) {
        throw new Error("You have already voted in this contest");
      }
      return photoId;
    });

    await runTransaction(photoRef, (photoData) => {
      if (photoData === null) return null;
      photoData.voteCount = (photoData.voteCount || 0) + 1;
      return photoData;
    });
  }

  async getVotedPhoto(contestId) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const userVoteRef = ref(this.database, `users/${user.uid}/contests/${contestId}/vote`);
    const snapshot = await get(userVoteRef);
    return snapshot.val();
  }
}

export default new VoteService();
