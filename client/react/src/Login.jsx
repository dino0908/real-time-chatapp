import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import {
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Text,
  } from "@chakra-ui/react";

  import { signIn } from "./firebase";


function Login() {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [signInUnsuccessful, setSignInUnsuccessful] = useState(false)

    const fastLogin = () => {
      setEmail('dinokhaw@yahoo.com.sg')
      setPassword('password')
    }

    const stuartLogin = () => {
      setEmail('stuartkhaw@yahoo.com.sg')
      setPassword('password')
    }
    const handleLogin = async () => {
      try {
        const signInResponse = await signIn(email, password)
        navigate('/chat')
        // if (response.data.success == true) {
        //   navigate("/chat");
        // } else {
        //   
        // }
        console.log(signInResponse)

      } catch (error) {
        setSignInUnsuccessful(true)
        console.log(error);
      }
    };

  return (
    <React.Fragment>
      <Navbar />
      <Box
        h="calc(100vh - 70px)"
        mx={"auto"}
        textAlign={"center"}
        bgColor={"#F9F9F9"}
      >
        <Box marginBottom={"30px"} paddingTop={"50px"}>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            Login to
          </Text>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            start messaging!
          </Text>
        </Box>

        <Input
          w="40%"
          marginBottom={"30px"}
          type="text"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></Input>

        <InputGroup w="40%" size="md" mx={"auto"} marginBottom={"20px"}>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {signInUnsuccessful && <p>Email or password incorect. Please try again.</p>}
        <Button colorScheme="blue" onClick={handleLogin}>
          Login
        </Button>
        <Button colorScheme="blue" onClick={fastLogin} marginLeft={'30px'}>
          fast login (dev)
        </Button>
        <Button colorScheme="blue" onClick={stuartLogin} marginLeft={'30px'}>
          stuart login
        </Button>
      </Box>
    </React.Fragment>
  )
}

export default Login
