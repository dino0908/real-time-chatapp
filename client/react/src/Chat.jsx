import React, { useState, useEffect } from "react";
import axios from "axios";

function Chat() {
  const [user, setUser] = useState("dino");

  useEffect(() => {
    const url = "http://localhost:8080/getUser";
    axios.get(url)
    .then((response) => {
      const id = response.data.id
      setUser(id)
    })
    .catch((error) => {
      console.log(error.message)
    })
  }, []);

  return <div>{user}</div>;
}

export default Chat;
