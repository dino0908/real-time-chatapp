const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} = require("firebase/firestore");

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
const db = getFirestore();

const addUserToDatabase = async (email, username, userid) => {
  const colRef = collection(db, "users");
  try {
    addDoc(colRef, {
      username: username,
      email: email,
      UID: userid,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

const getUserID = async () => {
  return auth.currentUser;
};

const getUsername = async (userID) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("UID", "==", userID))
  try {
    const snapshot = await getDocs(q)
    const username = snapshot.docs[0].data().username;
    return username
  }
  catch(error) {
    console.log(error)
  }
}

const getUsernames = async (search) => {
  const colRef = collection(db, "users");
  const searchLowerCase = search.toLowerCase();
  const snapshot = await getDocs(colRef);
  const matchingUsernames = snapshot.docs
    .map(doc => doc.data().username.toLowerCase())
    .filter(username => username.includes(searchLowerCase));

  return matchingUsernames;
};

const checkUsernameTaken = async (username) => {
    const colRef = collection(db, "users");
    const q = query(colRef, where("username", "==", username))
    var docCount = 0;
    try {
      const snapshot = await getDocs(q)
      snapshot.docs.forEach((doc) => {
        docCount++
      })
      if (docCount != 0) {
        return true
      }
      return false
    }
    catch(error) {
      console.log(error)
    }
};

const checkEmailTaken = async (email) => {
  const colRef = collection(db, 'users')
  const q = query(colRef, where('email', '==', email))
  var docCount = 0
  try {
    const snapshot = await getDocs(q)
    snapshot.docs.forEach((doc) => {
      docCount++
    })
    if (docCount != 0) {
      return true
    }
    return false
  }
  catch(error) {
    console.log(error)
  }
}



module.exports = { signUp, getUserID, getUsername, addUserToDatabase, checkUsernameTaken, checkEmailTaken, signIn, getUsernames };
