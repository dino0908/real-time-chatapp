import React from "react";
// import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState} from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";

import {
  Box,
  Center,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";

function Register() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

const handleRegistration = async () => {
    try {
      const url = 'http://localhost:8080/signup'
      const response = await axios.post(url, {
        email: email,
        password: password
      })
      if (response.data.success == true) {
        navigate('/chat')
      }
    }
    catch(error) {
      console.log(error)
    }
  } 


  return (
    <React.Fragment>
      <Box sx={{ marginTop: "100px", fontSize: "50px" }}>
        <Center>Registration page</Center>
      </Box>
      <Box>
        <Center>
          <Input w='40%' type="email" placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)}></Input>
        </Center>
      </Box>
      <Box>
        <Center marginTop={"20px"}>
          <InputGroup w="40%" size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Center>
      </Box>
      <Center marginTop={'20px'}>
        <Button colorScheme='blue' onClick={handleRegistration}>Register</Button>
      </Center>
      
    </React.Fragment>
  );

}

export default Register;
