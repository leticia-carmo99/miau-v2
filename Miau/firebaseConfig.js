// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJNHIJpHdDO-yKlYk5pjAL2xNsd7PI6yg",
  authDomain: "miauuu-84f5b.firebaseapp.com",
  projectId: "miauuu-84f5b",
  storageBucket: "miauuu-84f5b.firebasestorage.app",
  messagingSenderId: "754331540289",
  appId: "1:754331540289:web:f880831da9e02af870dfc0",
  measurementId: "G-2ZPTVTTEFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };