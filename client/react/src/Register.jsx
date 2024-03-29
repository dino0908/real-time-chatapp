import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";

import {
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
} from "@chakra-ui/react";

// import { signUp, returnUserInfo, addUserToDatabase } from "./firebase";

function Register() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailInUse, setEmailInUse] = useState(false)
  const [usernameInUse, setUsernameInUse] = useState(false)
  const navigate = useNavigate();
  const { registerUser } = useAuth()

  const handleRegistration2 = async () => {
    try {
      await registerUser(email, password)  
    }
    catch (error) {
      console.log(error)
    }
    
  }

  // const handleRegistration = async () => {
  //   try {
  //     await signUp(email, password)
  //     const response = await returnUserInfo()
  //     const uid = response.uid
  //     navigate('/chat')
  //     console.log('registration successful')
  //     await addUserToDatabase(email, username, uid);
  //     console.log('adding to db successful')
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <React.Fragment>
      <Navbar />
      <Box
        h="calc(100vh - 80px)"
        mx={"auto"}
        textAlign={"center"}
        bgColor={'#f2f2f2'}
      >
        <Box marginBottom={"30px"} paddingTop={"50px"} fontFamily={'Hind'}>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            Register for
          </Text>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            an account
          </Text>
        </Box>

        <Input
          w="40%"
          marginBottom={"30px"}
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          borderColor={'grey'}
            _hover={{ borderColor: "black" }}
        ></Input>
        {emailInUse && <p>Email is already in use.</p>}
        <br />
        <Input
          w="40%"
          marginBottom={"30px"}
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          borderColor={'grey'}
            _hover={{ borderColor: "black" }}
        ></Input>
        {usernameInUse && <p>Username is already in use.</p>}

        <InputGroup w="40%" size="md" mx={"auto"} marginBottom={"20px"}>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            borderColor={'grey'}
            _hover={{ borderColor: "black" }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button colorScheme="blue" onClick={handleRegistration2} w={'10%'} minW={'70px'}>
          Sign up
        </Button>
      </Box>
    </React.Fragment>
  );
}

export default Register;
