import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref as dbRef, push, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../config/conf.js";

class UploadService {
  constructor() {
    this.storage = getStorage(app);
    this.database = getDatabase(app);
    this.auth = getAuth(app);
    this.contestId = null;
  }

  setContestId(contestId) {
    this.contestId = contestId;
  }

  async uploadContestImage(file, quote, onProgress) {
    if (!this.contestId) {
      throw new Error("Contest ID not set. Call setContestId first.");
    }

    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("No user logged in");
      }
      const userId = user.uid;
      const userName = user.displayName || user.email || "Anonymous User";

      const userContestRef = dbRef(
        this.database,
        `users/${userId}/contests/${this.contestId}`,
      );
      const userContestSnapshot = await get(userContestRef);
      if (
        userContestSnapshot.exists() &&
        userContestSnapshot.val().hasSubmitted
      ) {
        throw new Error("You have already submitted an entry for this contest");
      }

      const fileRef = storageRef(
        this.storage,
        `contests/${this.contestId}/${userId}/${file.name}`,
      );
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at", downloadURL);
              const entryRef = push(
                dbRef(this.database, `contests/${this.contestId}/entries`),
              );
              await set(entryRef, {
                userId: userId,
                userName: userName,
                photoUrl: downloadURL,
                quote: quote,
                likeCount: 0,
                voteCount: 0,
                timestamp: Date.now(),
                isWinner: false
              });
              await set(userContestRef, {
                hasSubmitted: true,
                submittedPhotoId: entryRef.key,
              });
              console.log("Entry saved successfully");
              resolve({ id: entryRef.key, photoUrl: downloadURL });
            } catch (error) {
              console.error("Error in final upload step:", error);
              reject(error);
            }
          },
        );
      });
    } catch (error) {
      console.error("Error in uploadContestImage:", error);
      throw error;
    }
  }
}

export default new UploadService();
