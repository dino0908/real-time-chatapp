import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ActiveChat from "./components/ActiveChat";
import {
  Box,
  Flex,
  Input,
  InputLeftElement,
  InputGroup,
  Stack,
  VStack,
  Divider,
  Center,
  Heading,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import { BsEmojiSmile } from "react-icons/bs";

import { SearchIcon } from "@chakra-ui/icons";

function Chat() {
  const [userID, setUserID] = useState("dino");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    const newMessage = message;
    setMessages([...messages, newMessage]);
    setMessage('');
  };
  

  useEffect(() => {
    const url = "http://localhost:8080/getUser";
    axios
      .get(url)
      .then((response) => {
        const id = response.data.id;
        setUserID(id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div>
      <Sidebar></Sidebar>
      <Flex
        marginLeft="100px" //sidebar width is 100px
        flexDirection={"row"}
        height={"100vh"}
      >
        <Box flex={"20%"} minW={"180px"}>
          <Flex height={"100%"} flexDirection={"column"} bgColor={"#def4ff"}>
            <Flex flex={"10%"} alignItems={"center"} justifyContent={"center"}>
              <Stack spacing={4} alignItems={"center"}>
                <InputGroup w={"95%"}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon></SearchIcon>
                  </InputLeftElement>
                  <Input type="tel" placeholder="Search" bgColor={"white"} />
                </InputGroup>
              </Stack>
            </Flex>
            {/* bottom part with active chats */}
            <Box flex={"90%"} bgColor={"#edf9ff"}>
              <VStack spacing={0}>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
                <ActiveChat></ActiveChat>
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Box flex={"80%"} height={"100vh"}>
          <Flex flexDirection={"column"} height={"100%"}>
            <Box flex={"10%"} margin={"30px"}>
              <Flex flexDirection={"column"} gap={3}>
                <Heading>Stuart Khaw</Heading>
                <Flex flexDirection={"row"}>
                  <Box
                    w={"14px"}
                    h={"14px"}
                    borderRadius={"7px"}
                    bgColor={"#29ff5a"}
                    marginTop={"5px"}
                    marginRight={"10px"}
                  ></Box>
                  <Text color={"#8a8a8a"}>Active now</Text>
                </Flex>
              </Flex>
            </Box>
            <Center>
              <Divider border={"1px solid #cccccc"} w={"90%"}></Divider>
            </Center>

            {/* chat display with input to type messages */}
            <Box flex={"90%"}>
              <Flex flexDirection={"column"} h="100%">
                {/* chat display */}
                <Box flex={"85%"} borderBottom={"1px solid black"} overflowY={'auto'} maxHeight={'75vh'}>
                  {/* Render existing messages */}
                  {messages.map((message, index) => (
                    <div key={index}>
                      <Text margin={'30px'}>{message}</Text>
                    </div>
                  ))}
                </Box>

                {/* input portion */}
                <Flex flex={"15%"} alignItems={"center"} marginLeft={"20px"}>
                  <HStack w={"100%"} spacing={10}>
                    <BsEmojiSmile size={25} />
                    <Input
                      placeholder="Enter message"
                      w={"80%"}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      
                    />
                    <Button colorScheme="blue" onClick={handleSendMessage}>
                      Send
                    </Button>
                  </HStack>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}

export default Chat;
