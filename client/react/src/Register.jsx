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

import { signUp, returnUserInfo, addUserToDatabase, checkUsernameTaken } from "./firebase";

function Register() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailOrUsernameInUse, setEmailOrUsernameInUse] = useState(false)
  const navigate = useNavigate();
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const handleRegistration = async () => {
    try {
      const isUsernameTaken = await checkUsernameTaken(username)
      if (isUsernameTaken) {
        throw new Error();
      }
      await signUp(email, password)
      const response = await returnUserInfo()
      const uid = response.uid
      navigate('/chat')
      console.log('registration successful')
      const currentDate = new Date();
      const day = currentDate.getDate();
      const monthIndex = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
      await addUserToDatabase(email, username, uid, 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg', formattedDate);
      console.log('adding to db successful')
    } catch (error) {
      setEmailOrUsernameInUse(true)
      console.log(error)
    }
  };

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
        <br />
        {emailOrUsernameInUse && <p style={{color: "red"}}>Username or email is already in use.</p>} <br />
        <Button colorScheme="blue" onClick={handleRegistration} w={'10%'} minW={'70px'}>
          Sign up
        </Button>
      </Box>
    </React.Fragment>
  );
}

export default Register;
