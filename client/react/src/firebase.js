import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjn23hVp3olIo_g-UZo8HbPpPNJQFrc94",
  authDomain: "proj-56825.firebaseapp.com",
  projectId: "proj-56825",
  storageBucket: "proj-56825.appspot.com",
  messagingSenderId: "417906241019",
  appId: "1:417906241019:web:f20dd4e46b9c2c13f7ef5e",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();

export const test = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid)
      // ...
    } else {
      console.log('problem')
    }
  });
}

export const addUserToDatabase = async (email, username, userid) => {
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

export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getUserID = async () => {
  return auth.currentUser;
};

export const getUsername = async (userID) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("UID", "==", userID));
  try {
    const snapshot = await getDocs(q);
    const username = snapshot.docs[0].data().username;
    return username;
  } catch (error) {
    console.log(error);
  }
};

export const getUserIDFromUsername = async (username) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("username", "==", username));
  try {
    const snapshot = await getDocs(q);
    const userID = snapshot.docs[0].data().UID;
    return userID;
  } catch (error) {
    console.log(error);
  }
};

export const listOfUsernamesClientInActiveChatWith = async (userID) => {
  try {
    const colRef = collection(db, "chats");
    const snapshot = await getDocs(colRef);
    const arrayOfAllActiveChats = [] //contains objects, each object has .userID1 and .userID2
    const arrayOfIDsClientInActiveChatWith = []
    const arrayOfUsernamesClientInActiveChatWith = []
    snapshot.forEach((doc) => {
      arrayOfAllActiveChats.push(doc.data())
    });
    arrayOfAllActiveChats.forEach((obj) => {
      if (obj.userID1 == userID || obj.userID2 == userID) { //client in chat with someone
        if (userID == obj.userID1) {
          arrayOfIDsClientInActiveChatWith.push(obj.userID2)
        } else {
          arrayOfIDsClientInActiveChatWith.push(obj.userID1)
        }
      }
    })
    for (const id of arrayOfIDsClientInActiveChatWith) {
      const username = await getUsername(id)
      arrayOfUsernamesClientInActiveChatWith.push(username)
    }
    return arrayOfUsernamesClientInActiveChatWith
    
  } catch (error) {
    console.log(error);
  }
};

export const getUsernames = async (search, currentUserUsername) => {
  const colRef = collection(db, "users");
  const searchLowerCase = search.toLowerCase();
  const snapshot = await getDocs(colRef);
  const matchingUsernames = snapshot.docs
    .map((doc) => doc.data().username.toLowerCase())
    .filter(
      (username) =>
        username.includes(searchLowerCase) &&
        username !== currentUserUsername.toLowerCase()
    );

  const filteredUsernames = filterUsernamesThatHasStartedChat(
    matchingUsernames,
    currentUserUsername
  );
  return filteredUsernames;
};

export const filterUsernamesThatHasStartedChat = async (
  matchingUsernames,
  currentUserUsername
) => {
  const colRef = collection(db, "chats");
  try {
    const snapshot = await getDocs(colRef);
    const arrayOfDocObjects = [];
    snapshot.docs.forEach((doc) => {
      arrayOfDocObjects.push(doc.data());
    });
    const currentUserID = await getUserIDFromUsername(currentUserUsername);
    const arrayOfIDCurrentUserChattingWith = [];
    const arrayOfUsernameCurrentUserChattingWith = [];
    arrayOfDocObjects.forEach((obj) => {
      if (currentUserID == obj.userID1 || currentUserID == obj.userID2) {
        if (currentUserID == obj.userID1) {
          arrayOfIDCurrentUserChattingWith.push(obj.userID2);
        } else {
          arrayOfIDCurrentUserChattingWith.push(obj.userID1);
        }
      }
    });
    for (const id of arrayOfIDCurrentUserChattingWith) {
      const username = await getUsername(id);
      arrayOfUsernameCurrentUserChattingWith.push(username);
    }
    const filteredUsernames = matchingUsernames.filter((username) => {
      return !arrayOfUsernameCurrentUserChattingWith.includes(username);
    });
    return filteredUsernames;
  } catch (error) {
    console.log(error);
  }
};

export const checkUsernameTaken = async (username) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("username", "==", username));
  var docCount = 0;
  try {
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((doc) => {
      docCount++;
    });
    if (docCount != 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const checkEmailTaken = async (email) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("email", "==", email));
  var docCount = 0;
  try {
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((doc) => {
      docCount++;
    });
    if (docCount != 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

// add to db collections 'chat' the userID of both parties
export const startChat = async (userID1, userID2) => {
  const colRef = collection(db, "chats");
  try {
    addDoc(colRef, {
      userID1: userID1,
      userID2: userID2,
    });
    console.log("new chat added to database");
  } catch (error) {
    console.log(error);
  }
};

export const deleteChat = async (username1, username2) => {
  try {
    const userID1 = await getUserIDFromUsername(username1)
    const userID2 = await getUserIDFromUsername(username2)
    const colRef = collection(db, 'chats')
    const snapshot = await getDocs(colRef)
    const arrayOfDocs = []
    snapshot.docs.forEach((doc) => {
      arrayOfDocs.push({ id: doc.id, ...doc.data() });
    })
    const docToDelete = arrayOfDocs.find((doc) => {
      return (userID1 === doc.userID1 && userID2 === doc.userID2) || (userID1 == doc.userID2 && userID2 == doc.userID1);
    });
    if (docToDelete) {
      const { id } = docToDelete //correct id
      const docRef = doc(db, 'chats', id);
      await deleteDoc(docRef)
      console.log('Document deleted successfully')
    }
  }
  catch(error) {
    console.log(error)
  }
}
