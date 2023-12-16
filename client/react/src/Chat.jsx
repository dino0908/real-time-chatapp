import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";

function Chat() {
  const [userID, setUserID] = useState("dino");

  useEffect(() => {
    const url = "http://localhost:8080/getUser";
    axios
      .get(url)
      .then((response) => {
        const id = response.data.id;
        setUserID(id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div>
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100%"
        w="100px"
        bg="#E2E2E2"
        color="white"
        p={4}
      >
        
      </Box>

      <Box
      marginLeft='130px'>
        hi
      </Box>
    </div>
  );
}

export default Chat;
