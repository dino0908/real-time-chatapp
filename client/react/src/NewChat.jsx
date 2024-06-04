import React, { useState, useEffect } from "react";
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

function NewChat() {
  //get list of uid of friends of client
  //when displaying each person, only show add friend if that username's uid is not in this list
  //so can't add a friend who is already a friend
  const [clientFriendUsernames, setClientFriendUsernames] = useState([]);
  const [usernames, setUsernames] = useState([]); //each username that will show up
  const navigate = useNavigate();
  const [profilePicURL, setProfilePicURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
  ); // Profile picture of own user, to be displayed in side bar
  const [profilePictureUrls, setProfilePictureUrls] = useState({}); // Dictionary of profile pictures of all users that is listed when current user searches for new chat

  useEffect(() => {
    console.log('grape', usernames)
  }, [usernames])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await returnUserInfo();
        const uid = response.uid;
        const URL = await getProfilePicture(uid);
        setProfilePicURL(URL);
        //add logic to initialize client's friend UID list usestate variable
        //call a firebase function that goes into friends and checks every document, if document contains client's UID, other UID add to list
        const listOfUsernames = await findClientFriends(uid); //uid belongs to client, returns list of all UIDs client is friends with
        // setClientFriendUsernames(listOfUsernames);
        setClientFriendUsernames((clientFriendUsernames) => [
          ...clientFriendUsernames,
          listOfUsernames,
        ]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const pictures = {};
      for (const username of usernames) {
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
  }, [usernames]);

  const handleStartChat = async (clickedUsername) => {
    try {
      const response = await returnUserInfo();
      const userid1 = response.uid;
      const userid2 = await getUserIDFromUsername(clickedUsername);
      await startChat(userid1, userid2);
      console.log("chat started successfully");
      navigate("/chat", { state: { chattingWith: clickedUsername } });
    } catch (error) {
      console.log(error);
    }
  };

  //in this page implement logic that only shows add friend button if client is not friends with user
  //so can assume that every add friend button are 2 people that are not friends
  //client and username will be friends
  const handleAddFriend = async (username) => {
    try {
      //call makefriends
      const response = await returnUserInfo();
      const uid = response.uid;
      const clientusername = await getUsername(uid);
      await makeFriends(clientusername, username);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (search) => {
    try {
      if (search == "") {
        setUsernames([]);
      } else {
        const response = await returnUserInfo();
        const uid = response.uid;
        const username = await getUsername(uid);
        const getUsernamesResponse = await getUsernames(search, username);
        setUsernames(getUsernamesResponse);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Sidebar tab={"newchat"} dp={profilePicURL}></Sidebar>
      <Flex marginLeft={`min(15%, 150px)`} flexDirection={"column"} h={"100vh"}>
        <Flex flex={"20%"} bgColor={"#edf6fa"}>
          <Flex flex={"10%"} alignItems={"center"} justifyContent={"center"}>
            <Stack spacing={4} alignItems={"center"} w={"50%"}>
              <Heading fontSize={{ base: "20px", md: "32px", lg: "42px" }}>
                Start a new chat
              </Heading>
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
          bgColor={"white"}
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
                        name="Profile picture"
                        src={
                          profilePictureUrls[username] ||
                          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                        }
                      />
                      <Heading size={"lg"} marginTop={"5px"}>
                        {username}
                      </Heading>
                      <Spacer></Spacer>
                      <Button
                        bg={"#0865c2"}
                        color={"white"}
                        marginRight={"15px"}
                        marginTop={"5px"}
                        _hover={{ bg: "#055bb0" }}
                        onClick={() => handleStartChat(username)}
                      >
                        Start chat
                      </Button>
                    
                      {!clientFriendUsernames[0].includes(username) && (
                        <Button
                          bg={"green"}
                          color={"white"}
                          marginRight={"15px"}
                          marginTop={"5px"}
                          _hover={{ bg: "#055bb0" }}
                          onClick={() => handleAddFriend(username)}
                        >
                          Add Friend
                        </Button>
                      )}
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
