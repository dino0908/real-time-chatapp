import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { SearchIcon } from "@chakra-ui/icons";
import { io } from "socket.io-client";
import {
  getUsername,
  returnUserInfo,
  getUserIDFromUsername,
  getProfilePicture,
  findClientFriends,
  searchFriends
} from "./firebase";

import {
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  Flex,
  Stack,
  Heading,
  VStack,
  Card,
  Avatar,
} from "@chakra-ui/react";

//purpose is to display all the friends of client
function FriendList() {
  const [friendOnlineStatuses, setFriendOnlineStatuses] = useState({}); // Object to store friend username (key) and online status (true/false)
  const [clientFriendUsernames, setClientFriendUsernames] = useState([]);
  const [profilePictureUrls, setProfilePictureUrls] = useState({}); // Dictionary of profile pictures of all users that is listed when current user searches for new chat
  const [socket, setSocket] = useState(null);
  const [userID, setUserID] = useState("");
  const [profilePicURL, setProfilePicURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
  ); // Profile picture of own user, to be displayed in side bar

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await returnUserInfo();
        const uid = response.uid;
        const URL = await getProfilePicture(uid);
        setUserID(uid);
        setProfilePicURL(URL);
        const listOfUsernames = await findClientFriends(uid);
        setClientFriendUsernames(listOfUsernames);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('apple', friendOnlineStatuses);
  }, [friendOnlineStatuses])

  useEffect(() => {
    const listener = async () => {
      try {
        if (socket) {
          const clientFriendIDs = []
          for (const username of clientFriendUsernames) {
            const id = await getUserIDFromUsername(username)
            clientFriendIDs.push(id)
          }
          console.log(clientFriendIDs)
          socket.emit("getOnlineStatuses", clientFriendIDs); // clientFriendIDs is correct when logged
          socket.on("onlineStatusResponse", (friendStatuses) => {
            setFriendOnlineStatuses(friendStatuses); // a mapping between userid and boolean status
          });  
        }
      } catch(error) {
        console.log(error.message);
      }
    }
    listener();
  }, [socket, userID, clientFriendUsernames])




  //search for friends
  const handleSearch = async (search) => {
    const response = await returnUserInfo();
    const uid = response.uid;
    const username = await getUsername(uid);
    try {
      if (search == "") {
        const friends = await findClientFriends(uid)
        setClientFriendUsernames(friends);
      } else {
        const result = await searchFriends(search, username);
        //username is client's username. should return list of friends of client that include search
        setClientFriendUsernames(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const pictures = {};
      for (const username of clientFriendUsernames) {
        try {
          const uid = await getUserIDFromUsername(username);
          const URL = await getProfilePicture(uid);
          pictures[username] = URL;
        } catch (error) {
          console.log(error.message);
        }
      }
      setProfilePictureUrls(pictures);
    };

    fetchProfilePictures();
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
        <Flex
          flex={"80%"}
          bgColor={"white"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box w={"50%"} h={"100%"}>
            {clientFriendUsernames.map((username, index) => (
              <div key={index}>
              <VStack>
                <Card w="100%" bgColor="white" h="80px" justifyContent="center" borderRadius="0px">
                  <Flex flexDirection="row" gap={5} marginLeft="30px">
                    <Avatar
                      name="Profile picture"
                      src={profilePictureUrls[username] || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"}
                    />
                    <Heading size="lg" marginTop="5px">
                      {username}
                      {/* Check if online status exists for the username in friendOnlineStatuses */}
                      {friendOnlineStatuses[username] !== undefined && (
                        <span style={{ color: friendOnlineStatuses[username] ? "green" : "red" }}>
                          {friendOnlineStatuses[username] ? " (online)" : " (offline)"}
                        </span>
                      )}
                    </Heading>
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

export default FriendList;
