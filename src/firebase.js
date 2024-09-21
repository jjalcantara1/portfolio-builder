import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4vPOdXwZtip1mdeXgzWrCvrvlDErruYI",
  authDomain: "portfolio-builder-a3870.firebaseapp.com",
  projectId: "portfolio-builder-a3870",
  storageBucket: "portfolio-builder-a3870.appspot.com",
  messagingSenderId: "1006930320031",
  appId: "1:1006930320031:web:b45479ac2ee4b8adf1a0aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
