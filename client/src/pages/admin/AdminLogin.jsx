import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from 'react';
import { gradiant } from "../../constants/Color";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";
const isadmin=true
const AdminLogin = () => {
  const [password,setpassword]=useState("")
  const secrekey=useInputValidation("")
  const submitHandler=()=>{

  }
  if(isadmin) return <Navigate to="/admin/dashboard"/>  
  return (
    <div style={{
      backgroundImage:gradiant
  }}>
      <Container component="main" maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <>
                  <Typography variant="h5">Admin Login</Typography>
                  <form onSubmit={submitHandler} style={{ width: "100%", marginTop: "1rem" }}>
                      <TextField
                          required
                          fullWidth
                          label="Password"
                          name="password"
                          type="password"
                          value={secrekey.value}
                          onChange={secrekey.changeHandler}
                          margin="normal"
                          variant="outlined"
                      />
                      <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth>Login</Button>
                  </form>
              </>
      </Paper>
  </Container>
  </div>
  )
}

export default AdminLogin