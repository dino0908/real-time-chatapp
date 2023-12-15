import React from "react";
import backgroundImage from "../assets/backgroundImage.svg";
import phone from "..//assets/phone.png";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  Button,
  Stack,
  Center,
  Image,
} from "@chakra-ui/react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <Box
        h="70px"
        bg="white"
        color="black"
        paddingY="2"
        textAlign="center"
        fontSize="lg"
        fontWeight="bold"
      >
        <Flex direction="row" justifyContent="space-between" padding="4">
          <Box w="70px">
            <Heading size="xs">Dino's Chat App</Heading>
          </Box>
          <Box>
            <HStack spacing="24px" marginTop={"10px"} marginLeft={"80px"}>
              <Text fontSize="12px">Features</Text>
              <Text fontSize="12px">Pricing</Text>
              <Text fontSize="12px">FAQ</Text>
              <Text fontSize="12px">About</Text>
              <Text fontSize="12px">Contact</Text>
            </HStack>
          </Box>
          <Box>
            <Stack direction="row" spacing={2}>
              <Button colorScheme="teal" variant="solid">
                Sign in
              </Button>
              <Button colorScheme="teal" variant="outline" onClick={()=>navigate('/signup')}>
                Start free
              </Button>
            </Stack>
          </Box>
        </Flex>
      </Box>

      {/* Main page */}
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