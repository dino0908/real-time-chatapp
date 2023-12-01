import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Typography, Button } from "@mui/material";
import { useState } from "react";
import axios from 'axios';

function Register() {
  const [name, setName] = useState("");

  const handleRegistration = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        username: name,
      });

      if (response.status === 200) {
        console.log("Registration successful:", response);
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <Typography
          variant="h4"
          justifyContent={"center"}
          display={"flex"}
          marginBottom={"30px"}
          
        >
          Register and start chatting!
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField id="input-with-sx" label="Name" variant="standard" onChange={(e) => setName(e.target.value)}/>
        </Box>
        <Button
          variant="contained"
          sx={{
            marginTop: "30px",
          }}
          onClick={handleRegistration}
        >
          Register
        </Button>
      </Box>
    </React.Fragment>
  );
}

export default Register;
