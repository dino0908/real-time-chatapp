import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, deleteDoc, doc, setDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAcsvFVtbJyUju3aZqBvQ7Xy0OWgIDB6pE",
  authDomain: "chatapp-6ec9f.firebaseapp.com",
  projectId: "chatapp-6ec9f",
  storageBucket: "chatapp-6ec9f.appspot.com",
  messagingSenderId: "368390895480",
  appId: "1:368390895480:web:ae2c06a97472866c86ba8d"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

export const returnUserInfo = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        unsubscribe();
        reject(new Error('No user signed in'));
      }
    });
  });
};

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
    console.log('reading document: firebase.js getusername function')
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
    console.log('reading document: firebase.js getuseridfromusername function')
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const userID = snapshot.docs[0].data().UID;
      return userID;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const loadMessages = async (userid1, userid2) => {
  const colRef = collection(db, 'chats');
  try {
    console.log('reading document: firebase.js loadmessage function')
    const snapshot = await getDocs(colRef);
    for (const document of snapshot.docs) {
      const data = document.data();
      if ((data.userID1 == userid1 && data.userID2 == userid2) || (data.userID1 == userid2 && data.userID2 == userid1)) {
        const chatID = document.id;
        const messagesRef = doc(db, "messages", chatID);
        try {
          console.log('reading document: firebase.js loadmessage function');
          const messagesDoc = await getDoc(messagesRef);
          const messagesData = messagesDoc.data();
          if (messagesData && messagesData.messages) {
            return Promise.resolve(messagesData.messages);
          } else {
            return Promise.resolve([]);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
    return Promise.resolve([]);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const sendMessage = async (newMessage, userid1, userid2) => {
  const colRef = collection(db, 'chats');
  try {
    const snapshot = await getDocs(colRef);
    snapshot.forEach(async (document) => {
      const data = document.data();
      if ((data.userID1 == userid1 && data.userID2 == userid2) || (data.userID1 == userid2 && data.userID2 == userid1)) {
        const chatID = document.id;
        const messagesRef = doc(db, "messages", chatID);
        try {
          const messagesDoc = await getDoc(messagesRef);
          if (messagesDoc.exists()) {
            const currentMessages = messagesDoc.data().messages || [];
            const updatedMessages = [...currentMessages, newMessage];
            await setDoc(messagesRef, { messages: updatedMessages }, { merge: true });
          } else {
            await setDoc(messagesRef, { messages: [newMessage] });
          }
        } catch (error) {
          console.log(error)
        }
      }
    });
  } catch (error) {
    console.log(error)
  }
};


export const listOfUsernamesClientInActiveChatWith = async (userID) => {
  try {
    const colRef = collection(db, "chats");
    const snapshot = await getDocs(colRef);
    const arrayOfAllActiveChats = []
    const arrayOfIDsClientInActiveChatWith = []
    const arrayOfUsernamesClientInActiveChatWith = []
    snapshot.forEach((doc) => {
      arrayOfAllActiveChats.push(doc.data())
    });
    arrayOfAllActiveChats.forEach((obj) => {
      if (obj.userID1 == userID || obj.userID2 == userID) {
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

//Add the userID of both parties to db collection 'chats' 
export const startChat = async (userID1, userID2) => {
  const colRef = collection(db, "chats");
  try {
    addDoc(colRef, {
      userID1: userID1,
      userID2: userID2,
    });
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
      const { id } = docToDelete
      const docRef = doc(db, 'chats', id);
      await deleteDoc(docRef)
    }
  }
  catch(error) {
    console.log(error)
  }
}
