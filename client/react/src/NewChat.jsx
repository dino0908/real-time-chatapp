import React from "react";
import { SearchIcon } from "@chakra-ui/icons";
import Sidebar from "./components/Sidebar";
import {
  Box,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Button,
  Text,
  Flex,
  Stack,
  Heading
} from "@chakra-ui/react";

function NewChat() {
  return (
    <div>
      <Sidebar></Sidebar>
      <Flex marginLeft={"100px"} flexDirection={"column"} h={"100vh"}>
        <Flex flex={"20%"} bgColor={"#def4ff"}>
          <Flex flex={"10%"} alignItems={"center"} justifyContent={"center"}>
            <Stack spacing={4} alignItems={"center"} w={'50%'}>
                <Heading>Start a new chat</Heading>
              <InputGroup w={"95%"}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon></SearchIcon>
                </InputLeftElement>
                <Input type="tel" placeholder="Search username" bgColor={"white"}/>
              </InputGroup>
            </Stack>
          </Flex>
        </Flex>
        {/* display search results (matching usernames in db) */}
        <Box flex={"80%"} bgColor={"#edf9ff"}>
            
        </Box>
      </Flex>
    </div>
  );
}

export default NewChat;
