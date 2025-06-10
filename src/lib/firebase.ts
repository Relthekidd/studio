// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAGsIEY4qnEltFlDoNYxjDPCIdhlH_VBOI',
  authDomain: 'sonix-8376b.firebaseapp.com',
  projectId: 'sonix-8376b',
  storageBucket: 'sonix-8376b.firebasestorage.app',
  messagingSenderId: '360311196596',
  appId: '1:360311196596:web:6f2be2310763f74d6c80e1',
  measurementId: 'G-NKMBT35SCP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app as firebaseApp };

if (typeof window !== 'undefined') {
  isSupported().then((ok) => {
    if (ok) {
      getAnalytics(app);
    }
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  storage,
  onAuthStateChanged,
  signInWithPopup,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
};
