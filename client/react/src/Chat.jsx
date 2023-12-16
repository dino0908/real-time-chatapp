import React, { useState, useEffect } from "react";
import axios from "axios";

function Chat() {
  const [userID, setUserID] = useState("dino");

  useEffect(() => {
    const url = "http://localhost:8080/getUser";
    axios.get(url)
    .then((response) => {
      const id = response.data.id
      setUserID(id)
    })
    .catch((error) => {
      console.log(error.message)
    })
  }, []);

  return <div>{userID}</div>;
}

export default Chat;
