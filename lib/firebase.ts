
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0gUmmC3szfqV43btiWs_NhirTkicFjvU",
  authDomain: "music-81e06.firebaseapp.com",
  projectId: "music-81e06",
  storageBucket: "music-81e06.firebasestorage.app",
  messagingSenderId: "23172927142",
  appId: "1:23172927142:web:0e55c5b346be7a42e16e67",
  measurementId: "G-YNXM52J6Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth service
export const auth = getAuth(app);

export default app;
