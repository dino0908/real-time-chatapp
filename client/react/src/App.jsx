import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Landing from "./Landing";
import Chat from "./Chat";
import NewChat from "./NewChat";
import Login from "./Login";
import Settings from "./Settings";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Private routes */}
            <Route exact path='/' element={<PrivateRoute/>}>
              <Route path="/chat" element={<Chat />} />
              <Route path="/newchat" element={<NewChat />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}


export default App;
