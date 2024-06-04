import { React, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { IoPersonAddOutline } from "react-icons/io5";
import { ChatIcon } from "@chakra-ui/icons";
import { CiSettings } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { getUsername, signUserOut } from "../firebase";
import { io } from "socket.io-client";
import { returnUserInfo } from "../firebase";

function Sidebar({ tab, dp }) {
  
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [socket, setSocket] = useState(null);

  const handleLogOut = async () => {
    const response = await returnUserInfo();
    const uid = response.uid;
    const username = getUsername(uid)
    try {
      signUserOut();
      socket.emit("logout");     //emit logout event to server
      navigate("/");
    } catch(error) {
      console.log(error.message)
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

  return (
    <div>
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100%"
        w="15%"
        maxW={"150px"}
        bg="#00162f"
        color="white"
        p={4}
        display="flex"
        flexDirection="column"
      >
        <Box flex="85%" borderBottom={"1px solid white"}>
          <VStack spacing={20}>
            <Avatar name="Profile picture" src={dp} />
            <Button
              bgColor={tab == "chat" ? "#0259bd" : "#00162f"}
              _hover={{ bg: "#4287f5" }}
              onClick={() => {
                navigate("/chat");
              }}
            >
              <ChatIcon size={23} color="white" />
            </Button>
            <Button
              bgColor={tab == "newchat" ? "#0259bd" : "#00162f"}
              _hover={{ bg: "#4287f5" }}
              onClick={() => {
                navigate("/newchat");
              }}
            >
              <IoPersonAddOutline size={23} color="white" />
            </Button>
            <Button
              bgColor={tab == "friends" ? "#0259bd" : "#00162f"}
              _hover={{ bg: "#4287f5" }}
              onClick={() => {
                navigate("/friends");
              }}
            >
              <IoPersonAddOutline size={23} color="white" />
            </Button>
            <Button
              bgColor={tab == "settings" ? "#0259bd" : "#00162f"}
              _hover={{ bg: "#4287f5" }}
              onClick={() => {
                navigate("/settings");
              }}
            >
              <CiSettings size={25} color="white" />
            </Button>
          </VStack>
        </Box>

        <Box flex="15%">
          <VStack spacing={12} mt={9}>
            <Button bgColor={"#00162f"} _hover={{ bg: "#db1200" }}>
              <RxExit size={21} color="white" onClick={onOpen} />
            </Button>
          </VStack>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginTop="40vh"
        >
          <ModalHeader>Are you sure you want to logout?</ModalHeader>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleLogOut}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Sidebar;
