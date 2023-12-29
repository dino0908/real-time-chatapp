import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjn23hVp3olIo_g-UZo8HbPpPNJQFrc94",
  authDomain: "proj-56825.firebaseapp.com",
  projectId: "proj-56825",
  storageBucket: "proj-56825.appspot.com",
  messagingSenderId: "417906241019",
  appId: "1:417906241019:web:f20dd4e46b9c2c13f7ef5e",
};

initializeApp(firebaseConfig);

const auth = getAuth();

export const sayHi = () => {
    console.log('hi')
}

const getUserID = async () => {
  return auth.currentUser;
};