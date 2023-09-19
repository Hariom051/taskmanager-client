"use client";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { validation } from "@/validation/validation";
import { useRouter } from "next/navigation";
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
import "react-toastify/dist/ReactToastify.css";
import CustomToaster from "@/shared/components/CustomToaster";
import { toaster } from "@/shared/utils/toastify";
import { yupResolver } from "@hookform/resolvers/yup";
const defaultTheme = createTheme();
const Login:React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: yupResolver(validation.schemaforLogin) });

  const router = useRouter();
  const onSubmit = async (data: any) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // Set to false to handle the result manually
      callbackUrl: "/",
    });

    if (result?.error) {
      // Authentication failed, display an error toast message
      toaster.error("Invalid username or password");
    } else {
      // Authentication succeeded, you can optionally redirect here
      router.push("/");
    }
  };

  const signinwithgoogle = () => {
    signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
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
            Sign in
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Button
              onClick={signinwithgoogle}
              fullWidth
              color="secondary"
              variant="outlined"
            >
              Continue With Google
            </Button>
            <Typography style={{ display: "flex", justifyContent: "center" }}>
              {" "}
              OR
            </Typography>

            <TextField
              {...register("email")}
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errors.email} // Set error prop based on whether there's an error
              helperText={errors.email?.message || ""} // Display error message in helper text
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
              error={!!errors.password} // Set error prop based on whether there's an error
              helperText={errors.password?.message || ""} // Display error message in helper text
            />
            <Button
              disabled={isSubmitting || !isValid}
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
              <Link href="/register">Don&apos;t have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <CustomToaster />
    </ThemeProvider>
  );
};

export default Login;
