import { getDatabase, ref, runTransaction, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../config/conf.js";

class LikeService {
  constructor() {
    this.database = getDatabase(app);
    this.auth = getAuth(app);
  }

  async likePhoto(contestId, photoId) {
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
          return { likedPhoto: photoId };
        }

        if (userData.likedPhoto === photoId) {
          delete userData.likedPhoto;
        } else {
          userData.likedPhoto = photoId;
        }

        return userData;
      });

      await runTransaction(photoRef, (photoData) => {
        if (photoData === null) return null;

        if (!photoData.likeCount) photoData.likeCount = 0;

        const userLiked = photoData.likes && photoData.likes[user.uid];
        if (userLiked) {
          photoData.likeCount = Math.max(0, photoData.likeCount - 1);
          delete photoData.likes[user.uid];
        } else {
          photoData.likeCount++;
          if (!photoData.likes) photoData.likes = {};
          photoData.likes[user.uid] = true;
        }

        return photoData;
      });

      console.log("Like operation successful");
    } catch (error) {
      console.error("Like operation failed:", error);
      throw error;
    }
  }

  async getLikedPhoto(contestId) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userContestRef = ref(
        this.database,
        `users/${user.uid}/contests/${contestId}`,
      );
      const snapshot = await get(userContestRef);
      const userData = snapshot.val();

      return userData ? userData.likedPhoto : null;
    } catch (error) {
      console.error("Get liked photo operation failed:", error);
      throw error;
    }
  }
}

export default new LikeService();
