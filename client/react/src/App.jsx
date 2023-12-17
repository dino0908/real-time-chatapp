import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Landing from "./Landing";
import Chat from "./Chat";
import NewChat from "./NewChat";
import Login from "./Login";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/newchat" element={<NewChat/>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
