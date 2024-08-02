// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlc_1loWvnnQVipYb2ClylUDF4db7pVuM",
  authDomain: "dtu-pixels.firebaseapp.com",
  projectId: "dtu-pixels",
  storageBucket: "dtu-pixels.appspot.com",
  messagingSenderId: "733502370431",
  appId: "1:733502370431:web:94b756bd5816906578c54a",
  measurementId: "G-EMEMPYH7DV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
