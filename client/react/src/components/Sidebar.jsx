import React from "react";
import {
  Box,
  Avatar,
  VStack,
} from "@chakra-ui/react";

import { ChatIcon, PhoneIcon, BellIcon } from "@chakra-ui/icons";
import { CiSettings } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
function Sidebar() {
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
            <ChatIcon />
            <PhoneIcon />
            <BellIcon />
          </VStack>
        </Box>

        <Box flex="15%">
          <VStack spacing={12} mt={5}>
            <CiSettings size={30} />
            <RxExit size={23} />
          </VStack>
        </Box>
      </Box>
    </div>
  );
}

export default Sidebar;
