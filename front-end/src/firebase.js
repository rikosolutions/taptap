import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXABiuDmUX1QwWg9PvvpcbzEKOZ9zhxKw",
  authDomain: "taptap-a9390.firebaseapp.com",
  projectId: "taptap-a9390",
  storageBucket: "taptap-a9390.appspot.com",
  messagingSenderId: "1027908892209",
  appId: "1:1027908892209:web:85eefb8bcdbeb09dbf4710",
  measurementId: "G-YELFFTR2FR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
