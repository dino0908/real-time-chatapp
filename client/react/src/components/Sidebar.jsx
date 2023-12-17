import React from "react";
import { Box, Avatar, VStack, Button, Divider } from "@chakra-ui/react";
import { IoPersonAddOutline } from "react-icons/io5";
import { ChatIcon } from "@chakra-ui/icons";
import { CiSettings } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  return (
    <div>
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100%"
        w="100px"
        bg="#00162f"
        color="white"
        p={4}
        display="flex"
        flexDirection="column"
      >
        <Box flex="85%" borderBottom={"1px solid white"}>
          <VStack spacing={20}>
            <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
            <Button
              bgColor={"#00162f"}
              _hover={{ bg: "#4287f5" }}
              onClick={() => {
                navigate("/chat");
              }}
            >
              <ChatIcon size={23} color="white" />
            </Button>
            <Button
              bgColor={"#00162f"}
              _hover={{ bg: "#4287f5" }}
              onClick={() => {
                navigate("/newchat");
              }}
            >
              <IoPersonAddOutline size={23} color="white" />
            </Button>
            <Button bgColor={"#00162f"} _hover={{ bg: "#4287f5" }}>
              <CiSettings size={25} color="white" />
            </Button>
          </VStack>
        </Box>

        <Box flex="15%">
          <VStack spacing={12} mt={9}>
            <Button bgColor={"#00162f"} _hover={{ bg: "#db1200" }}>
              <RxExit
                size={21}
                color="white"
                onClick={() => {
                  navigate("/");
                }}
              />
            </Button>
          </VStack>
        </Box>
      </Box>
    </div>
  );
}

export default Sidebar;
