// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA27QB_PBo3wXq055FwLWYYrPMl0YuOvoI",
  authDomain: "siyabonga07-dbbab.firebaseapp.com",
  projectId: "siyabonga07-dbbab",
  storageBucket: "siyabonga07-dbbab.firebasestorage.app",
  messagingSenderId: "353614005039",
  appId: "1:353614005039:web:51e2b55cdf19afb11bd7da",
  measurementId: "G-JBL9YC56TZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
