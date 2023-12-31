import React, { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import Sidebar from "./components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  Flex,
  Stack,
  Heading,
  VStack,
  Card,
  Avatar,
  Spacer,
} from "@chakra-ui/react";

import { getUsername, returnUserInfo, getUsernames, getUserIDFromUsername, startChat } from './firebase'


function NewChat() {
  const [usernames, setUsernames] = useState([]);
  const navigate = useNavigate();

  const handleStartChat = async (clickedUsername) => {
    try {
      const response = await returnUserInfo()
      const userid1 = response.uid
      const userid2 = await getUserIDFromUsername(clickedUsername)
      await startChat(userid1, userid2)
      console.log('chat started successfully')
      navigate('/chat', { state: { chattingWith: clickedUsername } });
    }
    catch(error) {
      console.log(error)
    }
  };

  const handleSearch = async (search) => {
    try {
      if (search == "") {
        setUsernames([]);
      } else {
        const response = await returnUserInfo()
        const uid = response.uid
        const username = await getUsername(uid)
        const getUsernamesResponse = await getUsernames(search, username)
        setUsernames(getUsernamesResponse)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Sidebar tab={'newchat'}></Sidebar>
      <Flex marginLeft={"100px"} flexDirection={"column"} h={"100vh"}>
        <Flex flex={"20%"} bgColor={"#def4ff"}>
          <Flex flex={"10%"} alignItems={"center"} justifyContent={"center"}>
            <Stack spacing={4} alignItems={"center"} w={"50%"}>
              <Heading>Start a new chat</Heading>
              <InputGroup w={"95%"}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon></SearchIcon>
                </InputLeftElement>
                <Input
                  type="tel"
                  placeholder="Search username"
                  bgColor={"white"}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </InputGroup>
            </Stack>
          </Flex>
        </Flex>
        {/* display search results (matching usernames in db) */}
        <Flex
          flex={"80%"}
          bgColor={"#edf9ff"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box w={"50%"} h={"100%"} overflowY={"auto"}>
            {/* list of usernames here */}
            {usernames.map((username, index) => (
              <div key={index}>
                <VStack>
                  <Card
                    w={"100%"}
                    bgColor={"white"}
                    h="80px"
                    justifyContent={"center"}
                    borderRadius={"0px"}
                  >
                    <Flex flexDirection={"row"} gap={5} marginLeft={"30px"}>
                      <Avatar
                        name="Dan Abrahmov"
                        src="https://bit.ly/dan-abramov"
                      />
                      <Heading size={"lg"} marginTop={"5px"}>
                        {username}
                      </Heading>
                      <Spacer></Spacer>
                      <Button
                        bg={"teal"}
                        color={"white"}
                        marginRight={"15px"}
                        marginTop={"5px"}
                        _hover={{ bg: "#009191" }}
                        onClick={() => handleStartChat(username)}
                      >
                        Start chat
                      </Button>
                    </Flex>
                  </Card>
                </VStack>
              </div>
            ))}
          </Box>
        </Flex>
      </Flex>
    </div>
  );
}

export default NewChat;
