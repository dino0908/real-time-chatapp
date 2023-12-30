import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ActiveChat from "./components/ActiveChat";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
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
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AiOutlineMore } from "react-icons/ai";
import { SearchIcon } from "@chakra-ui/icons";
import {
  getUsername,
  listOfUsernamesClientInActiveChatWith,
  returnUserInfo,
  deleteChat,
  sendMessage,
  getUserIDFromUsername,
  loadMessages
} from "./firebase";

function Chat() {
  const [userID, setUserID] = useState(""); //client's userid
  const [username, setUsername] = useState(""); //client's username
  const [usernamesClientChattingWith, setUsernamesClientChattingWith] =
    useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesBoxRef = useRef();
  const [searchInput, setSearchInput] = useState("");
  const [chattingWith, setChattingWith] = useState("");
  const location = useLocation();
  const { chattingWith: newChattingWith } = location.state || {}; //extracts chattingWith property from location.state, renames to newChattingWith
  const [socket, setSocket] = useState(null);
  const [allMessages, setAllMessages] = useState([])

  const handleChatSelection = async (selectedUsername) => {
    setChattingWith(selectedUsername);
  
    // Perform other actions...
    try {
      const selectedUserID = await getUserIDFromUsername(selectedUsername)
      const result = await loadMessages(userID, selectedUserID)
      setAllMessages(result)
      console.log(result)
    }
    catch(error) {
      console.log(error)
    }
    
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await returnUserInfo();
      const uid = response.uid;
      const username = await getUsername(uid);
      setUsername(username);
      setUserID(uid);
      const listofusernames = await listOfUsernamesClientInActiveChatWith(uid);
      setUsernamesClientChattingWith(listofusernames);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteChat = async () => {
    try {
      const username1 = username;
      const username2 = chattingWith;
      await deleteChat(username1, username2);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (newChattingWith) {
      setChattingWith(newChattingWith);
    }
  }, [newChattingWith]);

  //this is the client listener meant for listening for new message emits from server
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      if (userID === data.toUserID) {
        // Message is meant for this client
        console.log(data.text);
        const newMessage = {
          text: data.text,
          senderUsername: data.fromUsername,
        };
        

        // setMessages([...messages, newMessage]);
        setMessage("");
      }
    };

    socket.on("chat message", handleIncomingMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("chat message", handleIncomingMessage);
    };
  }, [socket, userID, messages]);

  useEffect(() => {
    if (socket && userID) {
      socket.emit("setUserID", userID);
    }
  }, [socket, userID]);

  const handleSendMessage = async () => {
    if (message !== "") {
      const newMessage = {
        text: message,
        senderUsername: username, // Include the sender's username
      };
  
      //newMessage need to be added to db
      const userid1 = userID
      const userid2 = await getUserIDFromUsername(chattingWith)
      const sendMessageResponse = await sendMessage(newMessage, userid1, userid2)
      // setMessages([...messages, newMessage]);
      setMessage("");
  
      // Emit the message to the server
      if (socket && chattingWith) {
        socket.emit("chat message", {
          text: message,
          toUsername: chattingWith,
          fromUserID: userID,
          fromUsername: username,
        });
      }
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
  }, [messages]);

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
                  <Input
                    type="tel"
                    placeholder="Search"
                    bgColor={"white"}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </InputGroup>
              </Stack>
            </Flex>
            {/* bottom part with active chats */}
            userid : {userID} <br />
            user : {username} <br />
            chattingwith: {chattingWith} <br />
            <Box flex={"90%"} bgColor={"#edf9ff"}>
              <VStack spacing={0} mt={3}>
                {usernamesClientChattingWith
                  .filter((username) =>
                    username.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((username, index) => (
                    <ActiveChat
                      key={index}
                      username={username}
                      onClick={() => handleChatSelection(username)}
                    />
                  ))}
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Box flex={"80%"} height={"100vh"}>
          <Flex flexDirection={"column"} height={"100%"}>
            <Box flex={"10%"} margin={"30px"}>
              <Flex flexDirection={"column"} gap={3}>
                <Heading>{chattingWith}</Heading>
                <Flex flexDirection={"row"} marginRight={"30px"}>
                  {chattingWith && (
                    <>
                      <Box
                        w={"14px"}
                        h={"14px"}
                        borderRadius={"7px"}
                        bgColor={"#29ff5a"}
                        marginTop={"5px"}
                        marginRight={"10px"}
                      ></Box>
                      <Text color={"#8a8a8a"}>Active now</Text>
                    </>
                  )}
                  <Spacer></Spacer>
                  <Menu>
                    <MenuButton
                      as={Button}
                      colorScheme="white"
                      _hover={{ bg: "#F1F1F1" }}
                    >
                      <AiOutlineMore size={"25px"} color="black" />
                    </MenuButton>
                    <MenuList>
                      <MenuItem textColor={"red"} onClick={handleDeleteChat}>
                        Delete chat
                      </MenuItem>
                    </MenuList>
                  </Menu>
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
                <Box
                  flex={"85%"}
                  borderBottom={"1px solid black"}
                  overflowY={"auto"}
                  maxHeight={"75vh"}
                  ref={messagesBoxRef}
                >
                  {/* Render existing messages */}
                  {allMessages.map((message, index) => (
  <div key={index}>
    <Text margin={"30px"}>
      {message.senderUsername === username
        ? "You"
        : message.senderUsername}
      : {message.text}
    </Text>
  </div>
))}

                </Box>

                {/* input portion */}
                <Flex flex={"15%"} alignItems={"center"} marginLeft={"20px"}>
                  <HStack w={"100%"} spacing={10}>
                    <Input
                      placeholder="Enter message"
                      w={"80%"}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      colorScheme="blue"
                      onClick={handleSendMessage}
                      marginRight={"10px"}
                    >
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
