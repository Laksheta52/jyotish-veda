import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAouLr4Y7Sd2LuU8QGZb3c11BxXI0UgxqM",
    authDomain: "jyotish-veda-2e766.firebaseapp.com",
    projectId: "jyotish-veda-2e766",
    storageBucket: "jyotish-veda-2e766.firebasestorage.app",
    messagingSenderId: "581126612340",
    appId: "1:581126612340:web:513c5eb7cdd8fc30d4b821",
    measurementId: "G-Q7QJZY4KV1"
};

// Initialize Firebase (prevent re-initialization in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

export default app;
