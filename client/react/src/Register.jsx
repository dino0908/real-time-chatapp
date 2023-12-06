import React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Typography, Button, TextField, Box, Alert } from "@mui/material";
import { useState} from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import socket from './socket';

function Register() {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      const url = "http://3.27.148.53:8080/api/register";
      const response = await axios.post(url, {
        username: name,
      });
      if (response.status == 200 && response.data.success == true) {
        socket.emit('set username', { username: name });
        navigate('/chat')
      } else if (response.status == 200 && response.data.success == false) {
        setErrorMessage("Username taken, please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration. Please try again.");
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

        {errorMessage && (
          <Alert severity="error" sx={{ marginTop: '10px'}}>
            {errorMessage}
          </Alert>
        )}

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
