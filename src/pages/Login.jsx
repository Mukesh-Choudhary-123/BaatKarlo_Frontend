import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/styledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import ForumIcon from "@mui/icons-material/Forum";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      console.log("User Name", username.value);
      console.log("Password", password.value);
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      console.log(data);
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong at Logging In...",
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const handleSignUp = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    // const toastId = toast.loading("Signing Up...");

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong at Signing Up..."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [toastShown, setToastShown] = useState(false);
  console.log(toastShown);

  useEffect(() => {
    const toastShownFlag = sessionStorage.getItem("toastShownFlag");
    if (!toastShownFlag) {
      toast.custom(
        (t) => (
          <div
            style={{
              backgroundColor: "whitesmoke",
              color: "#000",
              padding: "10px",
              borderRadius: "4px",
              maxWidth: "300px",
              textAlign: "center",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transform: t.visible ? "translateY(0)" : "translateY(-200%)",
              opacity: t.visible ? 1 : 0,
              transition: "all 0.5s ease-in-out",
            }}
          >
            <h3 style={{ color: "black" }}>
              Feel free to continue as a demo user 🥰
            </h3>
            <p style={{ color: "black" }}>
              <span style={{ fontWeight: "bold" }}>Username:</span> demo
            </p>
            <p style={{ color: "black" }}>
              <span style={{ fontWeight: "bold" }}>Password:</span> demo123
            </p>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        ),
        {
          duration: 5000, // Show for 5 seconds
          position: "top-center", // Position of the toast
        }
      );
      sessionStorage.setItem("toastShownFlag", "true");
    }
  }, []);

  return (
    <Box>
      {isLogin ? (
        <Container
          component={"main"}
          maxWidth="xs"
          sx={{
            // height: "100vh",
            marginTop: "5rem",
            marginBottom: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={9}
            sx={{
              // minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "rgb(52, 152, 219)",
                width: "100%",
                padding: 4,
              }}
            >
              <ForumIcon
                sx={{
                  color: "white",
                  height: "4rem",
                  width: "4rem",
                }}
              />
              <Typography variant="h4" color={"white"}>
                BaatKarlo
              </Typography>
              <Typography variant="h7" color={"white"}>
                Chat App
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              paddingTop={"1.4rem"}
              fontStyle={"oblique"}
            >
              Login
            </Typography>
            <form
              style={{
                width: "100%",
                padding: "2rem",
              }}
              onSubmit={handleLogin}
            >
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                Login
              </Button>
              <Typography textAlign={"center"} m={"1rem"} fontStyle={"oblique"}>
                OR
              </Typography>
              <Button
                fullWidth
                variant="text"
                onClick={toggleLogin}
                disabled={isLoading}
              >
                Sign Up Instead
              </Button>
            </form>
          </Paper>
        </Container>
      ) : (
        <Container
          component={"main"}
          maxWidth="xs"
          sx={{
            // minHeight: "100vh",
            marginTop: "5rem",
            marginBottom: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={9}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "rgb(52, 152, 219)",
                width: "100%",
                padding: 4,
              }}
            >
              <ForumIcon
                sx={{
                  color: "white",
                  height: "4rem",
                  width: "4rem",
                }}
              />
              <Typography variant="h4" color={"white"}>
                BaatKarlo
              </Typography>
              <Typography variant="h7" color={"white"}>
                Chat App
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              paddingTop={"1.4rem"}
              fontStyle={"oblique"}
            >
              Sign Up
            </Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
                padding: "2rem",
              }}
              onSubmit={handleSignUp}
            >
              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
                  src={avatar.preview}
                />

                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                  component="label"
                >
                  <>
                    <CameraAltIcon />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </>
                </IconButton>
              </Stack>
              {avatar.error && (
                <Typography
                  m={"1rem"}
                  color="error"
                  variant="caption"
                  width={"fit-conten"}
                  display={"block"}
                  textAlign={"center"}
                >
                  {avatar.error}
                </Typography>
              )}
              <TextField
                required
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Bio"
                margin="normal"
                variant="outlined"
                value={bio.value}
                onChange={bio.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />
              {username.error && (
                <Typography color="error" variant="caption">
                  {username.error}
                </Typography>
              )}
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                Sign Up
              </Button>
              <Typography textAlign={"center"} m={"1rem"} fontStyle={"oblique"}>
                OR
              </Typography>
              <Button
                fullWidth
                variant="text"
                onClick={toggleLogin}
                disabled={isLoading}
              >
                Login Instead
              </Button>
            </form>
          </Paper>
        </Container>
      )}
    </Box>
  );
};

export default Login;
