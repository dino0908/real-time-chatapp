import React from "react";
import { useState } from "react";
import axios from "axios";
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

function Login() {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleRegistration = async () => {
      try {
        const url = "http://localhost:8080/signup";
        const response = await axios.post(url, {
          email: email,
          password: password,
          username: username,
        });
        if (response.data.success == true) {
          navigate("/chat");
        }
      } catch (error) {
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
        ></Input>

        <InputGroup w="40%" size="md" mx={"auto"} marginBottom={"20px"}>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button colorScheme="blue" onClick={handleRegistration}>
          Login
        </Button>
      </Box>
    </React.Fragment>
  )
}

export default Login
