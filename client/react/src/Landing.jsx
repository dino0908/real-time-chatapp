import React from "react";
import phone from "../assets/phone.png";
import Navbar from "./components/Navbar";
import {
  Box,
  Text,
  Button,
  Center,
  Image,
} from "@chakra-ui/react";

function Landing() {

  return (
    <Box w={'100vw'} h={'100vh'}>
    <Navbar/>
      <Box
        h="calc(100vh - 80px)"
        bgColor={'#f2f2f2'}
        overflow={"hidden"}
      >
        <Box paddingTop={"30px"} marginRight={'20px'}>
          <Text fontSize={{ base: "32px", md: "45px", lg: "56px" }} fontWeight="bold" textAlign={"center"} fontFamily={'Bebas Neue'}>
            Real-time 
          </Text>
          <Text fontSize={{ base: "32px", md: "45px", lg: "56px" }} fontWeight="bold" textAlign={"center"} fontFamily={'Bebas Neue'}>
          chat messaging
          </Text>
          <Box w={'65%'} mx={"auto"} textAlign={"center"} marginTop={"30px"}>
            <Text fontFamily={'Saira Condensed'} fontSize={{ base: "15px", md: "18px", lg: "26px" }}>
              Connect with friends and colleagues instantly through our
              intuitive chat platform. Share ideas, collaborate on projects, and
              stay connected wherever you go. Experience seamless real-time
              communication with advanced features to enhance your messaging
              experience.
            </Text>
          </Box>

          <Center>
            <Image
              src={phone}
              alt="Phone Image"
              marginTop="8"
              boxSize={"350px"}
            />
          </Center>
        </Box>
      </Box>
    </Box>
  );
}

export default Landing;
