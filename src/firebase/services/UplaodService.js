import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref as dbRef, push, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../../config/conf.js";

export class ImageOps {
    storage;
    database;
    auth;

    constructor() {
        this.storage = getStorage(app);
        this.database = getDatabase(app);
        this.auth = getAuth(app);
    }

    async uploadImage(file, onProgress) {
        try {
            const user = this.auth.currentUser;
            if (!user) {
                throw new Error("No user logged in");
            }

            const userId = user.uid;
            const userName = user.displayName || user.email || "Anonymous User";
            const storageRef = ref(this.storage, `images/${userName}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

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
                            const imageData = {
                                urls: { regular: downloadURL },
                                user: {
                                    id: userId,
                                    name: userName,
                                },
                                timestamp: Date.now(),
                            };
                            const newImageRef = push(dbRef(this.database, "images"));
                            await set(newImageRef, imageData);
                            console.log("Data saved successfully");
                            resolve({ id: newImageRef.key, ...imageData });
                        } catch (error) {
                            console.error("Error in final upload step:", error);
                            reject(error);
                        }
                    },
                );
            });
        } catch (error) {
            console.error("Error in uploadImage:", error);
            throw error;
        }
    }
}

const imageOps = new ImageOps();
export default imageOps;
