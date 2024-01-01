import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ActiveChat from "./components/ActiveChat";
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
  loadMessages,
} from "./firebase";

function Chat() {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [usernamesClientChattingWith, setUsernamesClientChattingWith] =
    useState([]);
  const [message, setMessage] = useState("");
  const messagesBoxRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [chattingWith, setChattingWith] = useState("");
  const [socket, setSocket] = useState(null);
  const [allMessages, setAllMessages] = useState([]);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const reloadMessages = async () => {
    const selectedUserID = await getUserIDFromUsername(chattingWith);
    if (selectedUserID) {
      const result = await loadMessages(userID, selectedUserID);
      if (!arraysAreEqual(allMessages, result)) {
        setAllMessages(result);
      }
    }
  };

  const [debouncedReloadMessages] = useState(() =>
    debounce(reloadMessages, 500)
  );

  useEffect(() => {
    debouncedReloadMessages();
  }, [chattingWith, userID, allMessages]);

  const handleChatSelection = async (selectedUsername) => {
    setChattingWith(selectedUsername);
    try {
      const selectedUserID = await getUserIDFromUsername(selectedUsername);
      const result = await loadMessages(userID, selectedUserID);
      setAllMessages(result);
    } catch (error) {
      console.log(error);
    }
  };

  const arraysAreEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

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
        const username = await getUsername(uid);
        setUsername(username);
        setUserID(uid);
        const listofusernames = await listOfUsernamesClientInActiveChatWith(
          uid
        );
        setUsernamesClientChattingWith(listofusernames);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleDeleteChat = async () => {
    try {
      const username1 = username;
      const username2 = chattingWith;
      await deleteChat(username1, username2);
      const listofusernames = await listOfUsernamesClientInActiveChatWith(
        userID
      );
      setUsernamesClientChattingWith(listofusernames);
      setChattingWith("");
    } catch (error) {
      console.log(error);
    }
  };

  //Client listener, listening for new messages emits from server
  useEffect(() => {
    if (!socket || !userID) return;

    const handleIncomingMessage = (data) => {
      if (userID === data.toUserID) {
        console.log(data.text);
        const newMessage = {
          text: data.text,
          senderUsername: data.fromUsername,
        };

        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    socket.on("chat message", handleIncomingMessage);

    return () => {
      socket.off("chat message", handleIncomingMessage);
    };
  }, [socket, userID]);

  useEffect(() => {
    if (socket && userID) {
      socket.emit("setUserID", userID);
    }
  }, [socket, userID]);

  const handleSendMessage = async () => {
    if (message !== "") {
      const newMessage = {
        text: message,
        senderUsername: username,
      };
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");

      //newMessage need to be added to db
      const userid1 = userID;
      const userid2 = await getUserIDFromUsername(chattingWith);
      await sendMessage(newMessage, userid1, userid2);
      setMessage("");

      // Emit the message to the server
      if (socket && chattingWith) {
        socket.emit("chat message", {
          text: message,
          toUsername: chattingWith,
          toUserID: userid2,
          fromUserID: userID,
          fromUsername: username,
        });
      }
    }
  };

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <div>
      <Sidebar tab={"chat"}></Sidebar>
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
          {chattingWith !== "" ? (
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
              <Box flex={"90%"}>
                <Flex flexDirection={"column"} h="100%">
                  <Box
                    flex={"85%"}
                    borderBottom={"1px solid black"}
                    overflowY={"auto"}
                    maxHeight={"75vh"}
                    ref={messagesBoxRef}
                  >
                    {chattingWith ? (
                      allMessages.map((message, index) => (
                        <div key={index}>
                          <Text margin={"30px"}>
                            {message.senderUsername === username
                              ? "You"
                              : message.senderUsername}
                            : {message.text}
                          </Text>
                        </div>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </Box>
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
          ) : (
            <Center height="100%">
              <Text>Select a chat to start messaging</Text>
            </Center>
          )}
        </Box>
      </Flex>
    </div>
  );
}

export default Chat;
