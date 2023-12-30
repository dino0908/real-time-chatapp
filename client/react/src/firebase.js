import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, deleteDoc, doc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

export const returnUserInfo = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
        unsubscribe(); // Stop listening for further changes
        resolve(user);
      } else {
        unsubscribe(); // Stop listening for further changes
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

export const loadMessages = async (userid1, userid2) => {
  //find chat document id with those 2 ids
  const colRef = collection(db, 'chats');
  
  try {
    const snapshot = await getDocs(colRef);

    for (const document of snapshot.docs) {
      const data = document.data();

      if ((data.userID1 == userid1 && data.userID2 == userid2) || (data.userID1 == userid2 && data.userID2 == userid1)) {
        const chatID = document.id;
        const messagesRef = doc(db, "messages", chatID);
        
        try {
          const messagesDoc = await getDoc(messagesRef);
          const messagesData = messagesDoc.data();
          
          if (messagesData && messagesData.messages) {
            // Resolve the promise with the messages data
            return Promise.resolve(messagesData.messages);
          } else {
            // If messages document or messages array does not exist, resolve with an empty array
            return Promise.resolve([]);
          }
        } catch (error) {
          // Reject the promise if there's an error fetching messages
          return Promise.reject(error);
        }
      }
    }

    // Resolve with an empty array if the chat document is not found
    return Promise.resolve([]);
  } catch (error) {
    // Reject the promise if there's an error fetching chats
    return Promise.reject(error);
  }
};


//use both userid to find the correct document in chats collection, note down document id, that is the messages document id to add to
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

            console.log("Message added successfully");
          } else {
            // If messages document does not exist, create an empty document
            await setDoc(messagesRef, { messages: [newMessage] });

            console.log("Empty messages document created successfully");
          }
        } catch (error) {
          console.error("Error updating messages:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
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

