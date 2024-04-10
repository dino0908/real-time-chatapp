import React, { useEffect, useState } from "react";
import { Flex, Text, Card, Avatar } from "@chakra-ui/react";
import { getProfilePicture, returnUserInfo, getUserIDFromUsername } from "../firebase";

function ActiveChat({ username, onClick }) {
  
  const [profilePicURL, setProfilePicURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = await getUserIDFromUsername(username)
        console.log(username, uid)
        const URL = await getProfilePicture(uid);
        setProfilePicURL(URL);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <Card
      width={"90%"}
      h={"80px"}
      bgColor={"white"}
      padding={"10px"}
      boxShadow={"none"}
      onClick={() => onClick(username)}
      style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
      _hover={{ bgColor: '#ebebeb', color: 'black' }}
      
    >
      <Flex flexDirection={"row"} h={"100%"} alignItems={"center"}>
        <Avatar name="Dan Abrahmov" src={profilePicURL} />
        <Flex flexDirection={"column"} marginLeft={"10px"}>
          <Text as={"b"}>{username}</Text>
          {/* <Text>recent message</Text> */}
        </Flex>
      </Flex>
      
    </Card>
  );
}

export default ActiveChat;
