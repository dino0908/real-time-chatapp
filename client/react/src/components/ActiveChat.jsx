import React from "react";
import {
  Flex,
  Text,
  Card,
  Avatar,
  Divider,
} from "@chakra-ui/react";

function ActiveChat() {
  return (
    <div>
      <Card
        width={"100%"}
        h={"80px"}
        bgColor={"#edf9ff"}
        padding={"10px"}
        boxShadow={"none"}
      >
        <Flex flexDirection={"row"} h={"100%"} alignItems={"center"}>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          <Flex flexDirection={"column"} marginLeft={"10px"}>
            <Text as={"b"}>User</Text>
            <Text>recent message</Text>
          </Flex>
        </Flex>
      </Card>
      <Divider border={"1px solid #cccccc"} w={"80%"}></Divider>
    </div>
  );
}

export default ActiveChat;
