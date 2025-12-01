import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut,GoogleAuthProvider,signInWithPopup, createUserWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);


export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();


export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function createUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}


export function logout() {
  return signOut(auth);
}


export function onUserChanged(callback) {
  return onAuthStateChanged(auth, callback);
}
