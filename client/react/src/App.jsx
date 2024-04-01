import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Landing from "./Landing";
import Chat from "./Chat";
import NewChat from "./NewChat";
import Login from "./Login";
import Settings from "./Settings";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "./routes/PrivateRoute";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true)
  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false)
        return
      }
      setUser(null)
      setIsFetching(false)
    })
    return ()=>unsubscribe();
  }, [])


  if (isFetching) {
    return <h2>Loading...</h2>
  }

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/chat" element={<PrivateRoute user={user}><Chat></Chat></PrivateRoute>}></Route>
          <Route path="/newchat" element={<PrivateRoute user={user}><NewChat></NewChat></PrivateRoute>}></Route>
          <Route path="/settings" element={<PrivateRoute user={user}><Settings></Settings></PrivateRoute>}></Route>

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
