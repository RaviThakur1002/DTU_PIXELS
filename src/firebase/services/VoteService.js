import { getDatabase, ref, runTransaction, get, update } from "firebase/database";
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

    await this.updateWinnerStatus(contestId);
  }

  async getVotedPhoto(contestId) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const userVoteRef = ref(this.database, `users/${user.uid}/contests/${contestId}/vote`);
    const snapshot = await get(userVoteRef);
    return snapshot.val();
  }

  async updateWinnerStatus(contestId) {
    const contestRef = ref(this.database, `contests/${contestId}/entries`);
    const snapshot = await get(contestRef);
    if (snapshot.exists()) {
      const entries = snapshot.val();
      let winningEntry = null;
      let winningId = null;

      Object.entries(entries).forEach(([id, entry]) => {
        if (!winningEntry || 
            entry.voteCount > winningEntry.voteCount || 
            (entry.voteCount === winningEntry.voteCount && entry.timestamp < winningEntry.timestamp)) {
          winningEntry = entry;
          winningId = id;
        }
      });

      // Update all entries to set isWinner to false
      const updates = {};
      Object.keys(entries).forEach(id => {
        updates[`${id}/isWinner`] = false;
      });

      // Set the winning entry's isWinner to true
      updates[`${winningId}/isWinner`] = true;

      await update(contestRef, updates);
    }
  }
}

export default new VoteService();
