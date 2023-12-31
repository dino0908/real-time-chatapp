import React from "react";
import backgroundImage from "../assets/backgroundImage.svg";
import phone from "..//assets/phone.png";
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
    <div>
    <Navbar/>
      <Box
        h="calc(100vh - 70px)"
        backgroundImage={`url(${backgroundImage})`}
        backgroundSize="cover"
        overflow={"hidden"}
      >
        <Box paddingTop={"30px"}>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            Real-time
          </Text>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            chat messaging
          </Text>
          <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
            with others
          </Text>
          <Box w={"600px"} mx={"auto"} textAlign={"center"} marginTop={"30px"}>
            <Text>
              Connect with friends and colleagues instantly through our
              intuitive chat platform. Share ideas, collaborate on projects, and
              stay connected wherever you go. Experience seamless real-time
              communication with advanced features to enhance your messaging
              experience.
            </Text>
          </Box>
          <Center marginTop={"20px"}>
            <Button colorScheme="teal" variant="solid">
              Get started
            </Button>
          </Center>
          <Center>
            <Image
              src={phone}
              alt="Phone Image"
              marginTop="8"
              boxSize={"300px"}
            />
          </Center>
        </Box>
      </Box>
    </div>
  );
}

export default Landing;
