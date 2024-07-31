import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
  runTransaction,
} from "firebase/database";
import app from "../../config/conf.js";

class ContestService {
  constructor() {
    this.database = getDatabase(app);
    this.contestRef = ref(this.database, "contests");
    this.highestIdRef = ref(this.database, "highestContestId");
  }

  async createContest(contestData) {
    try {
      let newContestId;
      await runTransaction(this.highestIdRef, (currentHighestId) => {
        if (currentHighestId === null) {
          newContestId = 1;
          return newContestId;
        } else {
          newContestId = currentHighestId + 1;
          return newContestId;
        }
      });
      await set(ref(this.database, `contests/${newContestId}`), {
        ...contestData,
        id: newContestId,
      });
      return newContestId;
    } catch (error) {
      console.error("Error creating contest: ", error.message);
      throw error;
    }
  }

  async getContestById(contestId) {
    const snapshot = await get(ref(this.database, `contests/${contestId}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  async getAllContests() {
    const snapshot = await get(this.contestRef);
    const contests = [];
    snapshot.forEach((childSnapshot) => {
      contests.push(childSnapshot.val());
    });
    return contests;
  }

  async getCurrentContest() {
    const snapshot = await get(this.contestRef);
    const currentTime = new Date().getTime();
    let currentContest = null;
    snapshot.forEach((childSnapshot) => {
      const contest = childSnapshot.val();
      const contestEndTime = new Date(`${contest.contestEndDate} ${contest.contestEndTime}`).getTime();
      if (currentTime <= contestEndTime) {
        currentContest = contest;
        return true;       }
    });
    return currentContest;
  }
}

const ContestServiceInstance = new ContestService();
export default ContestServiceInstance;
