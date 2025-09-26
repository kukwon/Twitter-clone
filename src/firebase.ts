import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsp7wbKZf3epm59dBXSfleGpid4A4u5x8",
  authDomain: "nwitter-reloaded-f7c3f.firebaseapp.com",
  projectId: "nwitter-reloaded-f7c3f",
  storageBucket: "nwitter-reloaded-f7c3f.firebasestorage.app",
  messagingSenderId: "987940761797",
  appId: "1:987940761797:web:27fd8a27197f40c86b80ac",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
