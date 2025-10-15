// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALozi9aN5jESOjN2qx6l0e9HMFO3spqeo",
  authDomain: "fir-crud-b1d62.firebaseapp.com",
  projectId: "fir-crud-b1d62",
  storageBucket: "fir-crud-b1d62.firebasestorage.app",
  messagingSenderId: "1084504464723",
  appId: "1:1084504464723:web:8dc3fcc2280f3f51efd5a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);