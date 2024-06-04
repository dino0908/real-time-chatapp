import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { SearchIcon } from "@chakra-ui/icons";
import {
  getUsername,
  returnUserInfo,
  getUsernames,
  getUserIDFromUsername,
  startChat,
  getProfilePicture,
  makeFriends,
  findClientFriends,
} from "./firebase";

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

//purpose is to display all the friends of client
function FriendList() {
  const [clientFriendUsernames, setClientFriendUsernames] = useState([]);
  const [test, setTest] = useState(['friend1', 'friend2']);

  const [profilePicURL, setProfilePicURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
  ); // Profile picture of own user, to be displayed in side bar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await returnUserInfo();
        const uid = response.uid;
        const URL = await getProfilePicture(uid);
        setProfilePicURL(URL);
        const listOfUsernames = await findClientFriends(uid); //findclientfriends is returning 
        console.log('orange', listOfUsernames) //correctly returns array of string containing usernames
        setClientFriendUsernames(listOfUsernames);
        // console.log(typeof(listOfUsernames)) //object
        
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('apple', clientFriendUsernames); //already contains the proper list of friends but doesn't display for some reason
    // console.log('banana', typeof(clientFriendUsernames)) //object
    // console.log('mango', Object.values(clientFriendUsernames))
  }, [clientFriendUsernames]);

  return (
    <div>
      <Sidebar tab={"friends"} dp={profilePicURL}></Sidebar>
      <Flex marginLeft={`min(15%, 150px)`} flexDirection={"column"} h={"100vh"}>
        <Flex flex={"20%"} bgColor={"#edf6fa"}>
          <Flex flex={"10%"} alignItems={"center"} justifyContent={"center"}>
            <Stack spacing={4} alignItems={"center"} w={"50%"}>
              <Heading fontSize={{ base: "20px", md: "32px", lg: "42px" }}>
                Friend List
              </Heading>
              <InputGroup w={"95%"}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon></SearchIcon>
                </InputLeftElement>
                <Input
                  type="tel"
                  placeholder="Search for friend"
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
          bgColor={"white"}
          alignItems={"center"}
          justifyContent={"center"}
        >
        <Box w={"50%"} h={"100%"}>
        
        {clientFriendUsernames.map((username, index) => {
             <div key={index}>{username}</div>
             //also call function and function returns online status
             //inside that function emit to server "getonlinestatus" event with iterator (username)
             //convert username to userid
             //server checks the mapping, passes userid as key and value is either true or false
             //server return 
        })}
        </Box>

      
          {/* <Box w={"50%"} h={"100%"}>
         {
            test.map((username, index) => (
            <div key={index}>{username}</div>
            ))
        }
        </Box> */}

        </Flex>
      </Flex>
    </div>
  );
}

export default FriendList;