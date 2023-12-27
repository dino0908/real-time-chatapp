import React from "react";
import { Flex, Text, Card, Avatar, Divider } from "@chakra-ui/react";

function ActiveChat({ username, onClick }) {
  const handleClick = () => {
    onClick(username);
  };

  return (
    <Card
      width={"90%"}
      h={"80px"}
      bgColor={"white"}
      padding={"10px"}
      boxShadow={"none"}
      onClick={() => onClick(username)} // onClick directly on Card
      style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
      _hover={{ bgColor: 'teal', color: 'white' }} // Change to your desired hover color
      
    >
      <Flex flexDirection={"row"} h={"100%"} alignItems={"center"}>
        <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
        <Flex flexDirection={"column"} marginLeft={"10px"}>
          <Text as={"b"}>{username}</Text>
          <Text>recent message</Text>
        </Flex>
      </Flex>
      
    </Card>
  );
}

export default ActiveChat;
