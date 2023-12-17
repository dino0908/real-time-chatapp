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
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

function Chat() {
  const [userID, setUserID] = useState("dino");

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
                  <Input type="tel" placeholder="Search" />
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
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Box flex={"80%"}>right box</Box>
      </Flex>
    </div>
  );
}

export default Chat;
