import React from "react";
import { Flex, Text, Card, Avatar } from "@chakra-ui/react";

function ActiveChat({ username, onClick }) {
  return (
    <Card
      width={"90%"}
      h={"80px"}
      bgColor={"white"}
      padding={"10px"}
      boxShadow={"none"}
      onClick={() => onClick(username)}
      style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
      _hover={{ bgColor: 'teal', color: 'white' }}
      
    >
      <Flex flexDirection={"row"} h={"100%"} alignItems={"center"}>
        <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
        <Flex flexDirection={"column"} marginLeft={"10px"}>
          <Text as={"b"}>{username}</Text>
          {/* <Text>recent message</Text> */}
        </Flex>
      </Flex>
      
    </Card>
  );
}

export default ActiveChat;
