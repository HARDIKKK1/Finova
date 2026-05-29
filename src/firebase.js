import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZimOpTdmiN-mGQAJxRQdtfBFs5ox3IxI",
  authDomain: "finova-65d71.firebaseapp.com",
  projectId: "finova-65d71",
  storageBucket: "finova-65d71.firebasestorage.app",
  messagingSenderId: "744709555035",
  appId: "1:744709555035:web:eca44d7ae2022cff8a107e",
  measurementId: "G-FKHCZNQWM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize analytics safely
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics, auth, googleProvider };
