import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { signIn } from "./firebase";
import { io } from "socket.io-client";
import {
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Text,
  } from "@chakra-ui/react";

  import { returnUserInfo } from "./firebase";

function Login() {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [signInUnsuccessful, setSignInUnsuccessful] = useState(false)
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const newSocket = io("http://localhost:8080");
      setSocket(newSocket);
      // Clean up the socket connection when the component unmounts
      return () => {
        newSocket.disconnect();
      };
    }, []);

    const handleLogin = async () => {
      try {
        await signIn(email, password)
        const response = await returnUserInfo();
        const uid = response.uid;
        socket.emit("login", uid); //Emit login event for server to handle
        navigate('/chat')
      } catch (error) {
        setSignInUnsuccessful(true)
        console.log(error.message);
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
            Sign in to
          </Text>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            your account
          </Text>
        </Box>

        <Input
          w="40%"
          maxW={'500px'}
          marginBottom={"30px"}
          type="text"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          borderColor={'grey'}
          _hover={{ borderColor: "black" }}
        ></Input>

        <InputGroup w="40%" size="md" mx={"auto"} marginBottom={"20px"} maxW={'500px'}>
          <Input
          
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            borderColor={'grey'}
            _hover={{ borderColor: "black" }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {signInUnsuccessful && <Text color={'red'} marginBottom={'15px'}>Email or password incorect. Please try again.</Text>}
        <Button colorScheme="blue" onClick={handleLogin} w={'10%'} minW={'70px'}>
          Login
        </Button>
      </Box>
    </React.Fragment>
  )
}

export default Login
