"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validation } from "@/validation/validation";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import CustomToaster from "@/shared/components/CustomToaster";
import { toaster } from "@/shared/utils/toastify";
import "react-toastify/dist/ReactToastify.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosInstance } from "@/shared/services/axiosInstance";
const defaultTheme = createTheme();
const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting,isValid },
  } = useForm({ resolver: yupResolver(validation.schemaforRegister) });
 

  const onSubmit = async (data: any) => {

    try {
      const response = await axiosInstance.post("/register", data);
       toaster.success(response.data.msg);
    } catch (e: any) {
      toaster.error(e.response.data.error);
    }
   
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email")}
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message || ""}
            />

            <TextField
              {...register("name")}
              margin="normal"
              fullWidth
              name="name"
              label="Name"
              id="name"
              autoComplete="current-name"
              error={!!errors.name}
              helperText={errors.name?.message || ""}
            />

            <TextField
              {...register("password")}
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message || ""}
            />

            <Button
              disabled={isSubmitting || !isValid}
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>

            <Grid container>
              <Grid item>
                <Link href="/login">Have an account? Sign In</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <CustomToaster />
    </ThemeProvider>
  );
};

export default Register;
