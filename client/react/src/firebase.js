import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, deleteDoc, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export const uploadFile = async (file) => {
  const storage = getStorage();
  const storageRef = ref(storage, file.name);

  // Return a promise to track the upload completion
  return new Promise((resolve, reject) => {
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      resolve(storageRef); // Resolve with the storage reference
    }).catch((error) => {
      reject(error); // Reject if there's an error during upload
    });
  });
}

export const getURL = async(storageRef) => {
  try {
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error; // Rethrow error for handling in the caller function
  }
}

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

export const signUserOut = async () => {
  try {
    signOut(auth)
  }
  catch(error) {
    console.log(error)
  }
}

export const addUserToDatabase = async (email, username, userid, profilePic, dateOfRegistration) => {
  const colRef = collection(db, "users");
  try {
    addDoc(colRef, {
      username: username,
      email: email,
      UID: userid,
      URL: profilePic,
      date: dateOfRegistration
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

export const getRegistrationDate = async (userID) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("UID", "==", userID));
  try {
    const snapshot = await getDocs(q);
    const date = snapshot.docs[0].data().date;
    return date;
  } catch (error) {
    console.log(error);
  }
};

export const getProfilePicture = async (userID) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("UID", "==", userID));
  try {
    const snapshot = await getDocs(q);
    const URL = snapshot.docs[0].data().URL;
    return URL;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfilePicture = async (userID, profilePictureURL) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("UID", "==", userID));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Update the URL field for each matching document
      setDoc(doc.ref, { URL: profilePictureURL }, { merge: true });
      console.log("Profile picture updated successfully");
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export const getUserIDFromUsername = async (username) => {
  const colRef = collection(db, "users");
  const q = query(colRef, where("username", "==", username));
  try {
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

//friends collection, each document is a 'friendship' and it stores uid of both parties
//inside here we need to go into friends collection, make the document
//at this point the document is not created or else the add friends button wouldn't show up to call this
export const makeFriends = async(username1, username2) => {
  try {
    //refer to the friends collection
    const colRef = collection(db, "friends");
    const userID1 = await getUserIDFromUsername(username1)
    const userID2 = await getUserIDFromUsername(username2)
    //add document (friendship) to collection
    addDoc(colRef, {
      uid1: userID1,
      uid2: userID2,
    });

  } catch (error) {
    console.log(error.message)
  }
}

//add logic to initialize client's friend UID list usestate variable
//call a firebase function that goes into friends and checks every document, if document contains client's UID, other UID add to list
export const findClientFriends = async(clientUID) => { //uid of client //this is returning an object instead of arr
  try {
    //this will return array of uids 
    const colRef = collection(db, "friends");
    const snapshot = await getDocs(colRef); //all documents inside friends, represents all friendships
    const arrayOfDocObjects = [];
    const arrayOfIDsClientFriendsWith = [];
    const arrayOfUsernamesClientFriendsWith = [];
    snapshot.docs.forEach((doc) => {
      arrayOfDocObjects.push(doc.data());
    });
    //arrayofDocObjects now contains all the documents
    
    arrayOfDocObjects.forEach(async (obj) => {
      if (clientUID == obj.uid1 || clientUID == obj.uid22) {
        if (clientUID == obj.uid1) {
          arrayOfIDsClientFriendsWith.push(obj.uid2);
        } else {
          // const friendUsername = await getUsername(obj.uid2)
          arrayOfIDsClientFriendsWith.push(obj.uid1);
        }
      }
    });
    for (const id of arrayOfIDsClientFriendsWith) {
      const username = await getUsername(id)
      arrayOfUsernamesClientFriendsWith.push(username);
    }
    return arrayOfUsernamesClientFriendsWith;
    // console.log('debug', typeof(arrayOfUsernamesClientFriendsWith)) // returns object
    // return arrayOfUsernamesClientFriendsWith //should be array but is object

  } catch (error) {
    console.log(error.message)
  }
}
//should return list of friends of client that include search
export const searchFriends = async (search, currentUserUsername) => {
  const searchLowerCase = search.toLowerCase();
  try {
    const uid = await getUserIDFromUsername(currentUserUsername);
    const friends = await findClientFriends(uid) //array of usernames client is friends with
    const filteredFriends = friends.filter((friend) => {
      return friend.toLowerCase().includes(searchLowerCase)
    })
    return filteredFriends
  } catch(error) {
    console.log(error.message)
  }



  return filteredFriends;
};