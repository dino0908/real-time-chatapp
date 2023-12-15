import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Landing from "./Landing";
import Chat from "./Chat";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
