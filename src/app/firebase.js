import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyB9k-8hx0owUquLNUfxs1uwV_9LrTYSpXk",
    authDomain: "pantry-f0017.firebaseapp.com",
    projectId: "pantry-f0017",
    storageBucket: "pantry-f0017.appspot.com",
    messagingSenderId: "764651190914",
    appId: "1:764651190914:web:d6668314668069329d529b",
    measurementId: "G-1ES86QV266"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };