import React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Typography, Button } from "@mui/material";

function Register() {

    const handleRegistration = () => {
        console.log('registered');
    }

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
          <TextField id="input-with-sx" label="Name" variant="standard" />
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
