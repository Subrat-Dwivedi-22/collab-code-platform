import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import IconButton from "@mui/material/IconButton";


import AppTheme from "../../shared-theme/AppTheme";
import ColorModeSelect from "../../shared-theme/ColorModeSelect";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: "24px",
  backdropFilter: "blur(24px)",
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.paperChannel} / 0.7)`
    : "rgba(255,255,255,0.7)",

  border: "1px solid",
  borderColor: theme.palette.divider,

  boxShadow: "hsla(220, 30%, 5%, 0.08) 0px 8px 24px",

  transition: "0.2s",

  "&:hover": {
    transform: "translateY(-4px)",
  },

  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.4) 0px 8px 24px",
  }),
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "100%",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const Rooms = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [roomName, setRoomName] = useState("");

  const [joinRoomId, setJoinRoomId] = useState("");

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(false);

  // FETCH MY ROOMS
  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await API.get("/rooms/my-rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRooms(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // LOAD ROOMS ONLY ONCE
  useEffect(() => {
    fetchRooms();
  }, []);

  // CREATE ROOM
  const createRoom = async () => {
    try {
      if (!roomName.trim()) {
        return alert("Room name required");
      }

      const res = await API.post(
        "/rooms/create",
        { roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate(`/editor/${res.data.roomId}`);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to create room");
    }
  };

  // JOIN ROOM
  const joinRoom = async () => {
    try {
      if (!joinRoomId.trim()) {
        return alert("Enter Room ID");
      }

      const res = await API.post(
        "/rooms/join",
        {
          roomId: joinRoomId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate(`/editor/${res.data.roomId}`);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to join room");
    }
  };

  // OPEN ROOM
  const openRoom = (roomId) => {
    navigate(`/editor/${roomId}`);
  };

  // GET CURRENT USER ID FROM TOKEN
  const getCurrentUserId = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // DELETE ROOM
  const deleteRoom = async (roomDbId) => {
    try {
      await API.delete(`/rooms/${roomDbId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // REFRESH ROOM LIST
      fetchRooms();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to delete room");
    }
  };

  const currentUserId = getCurrentUserId();

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <IconButton
  onClick={() => navigate("/")}
  disableRipple
  sx={(theme) => ({
    position: "fixed",
    top: "0.9rem",
    left: "0.9rem",

    width: 36,
    height: 36,

    borderRadius: "10px",

    border: "1px solid",
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.12)"
        : "rgba(0,0,0,0.12)",

    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(255,255,255,0.75)",

    backdropFilter: "blur(12px)",

    color: "text.primary",

    transition:
      "background-color 0.2s ease, border-color 0.2s ease",

    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.8)"
          : "rgba(255,255,255,0.05)",

      borderColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.18)"
          : "rgba(0,0,0,0.18)",
    },
  })}
>
  <HomeRoundedIcon
    sx={{
      fontSize: 18,
    }}
  />
</IconButton>

      <ColorModeSelect
        sx={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
        }}
      />

      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          pt: 6,
          pb: 8,

          backgroundImage:
            "radial-gradient(circle at top, hsl(210, 100%, 97%), white)",

          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(circle at top, hsla(210,100%,16%,0.5), hsl(220,30%,5%))",
          }),
        })}
      >
        <Container>
          {/* TITLE */}
          <Stack
            spacing={2}
            useFlexGap
            sx={{
              alignItems: "center",
              width: { xs: "100%", sm: "100%" },
              mb: 5,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                fontSize: "clamp(3rem, 10vw, 3.5rem)",
              }}
            >
              Coding&nbsp;
              <Typography
                component="span"
                variant="h1"
                sx={(theme) => ({
                  fontSize: "inherit",
                  color: "primary.main",
                  ...theme.applyStyles("dark", {
                    color: "primary.light",
                  }),
                })}
              >
                Rooms
              </Typography>
            </Typography>
          </Stack>

          {/* CREATE ROOM */}
          <Card
            variant="outlined"
            sx={{
              mb: 5,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2rem)" }}
            >
              Join Rooms
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                mb: 4,
                alignItems: "stretch",
              }}
            >
              <TextField
                fullWidth
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={createRoom}
                sx={{
                  minWidth: 160,
                  borderRadius: "12px",
                }}
              >
                Create Room
              </Button>
            </Stack>

            {/* JOIN ROOM */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                mb: 5,
                alignItems: "stretch",
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
              />

              <Button
                variant="contained"
                color="success"
                onClick={joinRoom}
                sx={{
                  minWidth: 160,
                  borderRadius: "12px",
                }}
              >
                Join Room
              </Button>
            </Stack>
          </Card>

          {/* ROOM LIST */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 3,
              fontWeight: 700,
            }}
          >
            Recent Rooms
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={3}>
              {rooms.map((room) => {
                const currentUser = room.participants.find(
                  (p) => p.user === currentUserId,
                );

                return (
                  <Grid item xs={12} md={6} key={room._id}>
                    <StyledCard
                      sx={(theme) => ({
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",

                        backdropFilter: "blur(24px)",

                        transition: "all 0.2s ease",

                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 10px 30px rgba(0,120,255,0.12)"
                              : "0 10px 30px rgba(0,0,0,0.08)",
                        },
                      })}
                    >
                      <CardContent
                        sx={{
                          p: 3,
                        }}
                      >
                        {/* HORIZONTAL LAYOUT */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 3,

                            flexDirection: {
                              xs: "column",
                              sm: "row",
                            },
                          }}
                        >
                          {/* LEFT */}
                          <Box
                            sx={{
                              flex: 1,
                              width: "100%",
                            }}
                          >
                            {/* ROOM NAME */}
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              {room.roomName}
                            </Typography>

                            {/* ROOM ID */}
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                mb: 2,
                              }}
                            >
                              Room ID
                            </Typography>

                            <Typography
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.82rem",
                                opacity: 0.85,
                                mb: 2.5,
                                wordBreak: "break-all",
                              }}
                            >
                              {room.roomId}
                            </Typography>

                            {/* CHIPS */}
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                label={
                                  currentUser?.role === "admin"
                                    ? "Admin"
                                    : "Member"
                                }
                                color={
                                  currentUser?.role === "admin"
                                    ? "error"
                                    : "primary"
                                }
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                }}
                              />

                              <Chip
                                label={`${room.participants.length} online`}
                                color="success"
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          </Box>

                          {/* RIGHT BUTTONS */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: {
                                xs: "row",
                                sm: "column",
                              },
                              gap: 1.2,
                              width: {
                                xs: "100%",
                                sm: 140,
                              },
                            }}
                          >
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => openRoom(room.roomId)}
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 700,
                                py: 1.1,
                                boxShadow: "none",
                              }}
                            >
                              Open
                            </Button>

                            {currentUser?.role === "admin" && (
                              <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={() => deleteRoom(room._id)}
                                sx={{
                                  borderRadius: "10px",
                                  textTransform: "none",
                                  fontWeight: 700,
                                  py: 1.1,
                                  boxShadow: "none",
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </AppTheme>
  );
};

export default Rooms;
