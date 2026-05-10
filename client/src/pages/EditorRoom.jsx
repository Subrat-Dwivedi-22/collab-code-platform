import AppTheme from "../../shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

import { useEffect, useState, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";

import { io } from "socket.io-client";

import API from "../api/axios";

import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Card,
} from "@mui/material";

const socket = io(
  import.meta.env.VITE_API_URL
);

const EditorRoom = () => {
  const { roomId } = useParams();

  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState(0);

  const [language, setLanguage] = useState("nodejs");

  const [output, setOutput] = useState("");

  const [running, setRunning] = useState(false);

  const messagesEndRef = useRef(null);

  const saveTimeout = useRef(null);

  const navigate = useNavigate();

  // JOIN ROOM
  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  // FETCH ROOM DATA
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCode(res.data.code || "// Start coding...");

        setLanguage(res.data.language || "nodejs");
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoom();
  }, [roomId]);

  // RECEIVE CODE
  useEffect(() => {
    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("receive-code");
    };
  }, []);

  // RECEIVE LANGUAGE
  useEffect(() => {
    socket.on("receive-language", (newLanguage) => {
      setLanguage(newLanguage);
    });

    return () => {
      socket.off("receive-language");
    };
  }, []);

  // RECEIVE MESSAGE
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  // ONLINE USERS
  useEffect(() => {
    socket.on("online-users", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  // RECEIVE ROOM STATE
  useEffect(() => {
    socket.on("room-state", (state) => {
      if (state.code) {
        setCode(state.code);
      }

      if (state.language) {
        setLanguage(state.language);
      }
    });

    return () => {
      socket.off("room-state");
    };
  }, []);

  // CODE CHANGE
  const handleCodeChange = (value) => {
    setCode(value);

    // REALTIME SOCKET SYNC
    socket.emit("code-change", {
      roomId,
      code: value,
    });

    // CLEAR PREVIOUS TIMER
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // SAVE AFTER USER STOPS TYPING
    saveTimeout.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");

        await API.put(
          "/rooms/save-code",
          {
            roomId,
            code: value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Code saved");
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      roomId,
      text: message,
    };

    socket.emit("send-message", data);

    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // RUN CODE
  const runCode = async () => {
    try {
      setRunning(true);

      setOutput("Running...");

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/code/run",
        {
          code,
          language,
          versionIndex:
            language === "nodejs"
              ? "4"
              : language === "python3"
                ? "4"
                : language === "java"
                  ? "4"
                  : "0",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOutput(res.data.output);
    } catch (error) {
      console.log(error);

      setOutput("Execution failed");
    } finally {
      setRunning(false);
    }
  };

  // LEAVE ROOM
  const leaveRoom = () => {
    socket.emit("leave-room", roomId);

    socket.emit("leave-room", roomId);

    navigate("/rooms");
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          p: 2,

          backgroundImage:
            "radial-gradient(circle at top, hsl(210, 100%, 97%), white)",

          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(circle at top, hsla(210,100%,16%,0.45), hsl(220,30%,5%))",
          }),
        })}
      >
        <Box
          sx={{
            height: "calc(100vh - 32px)",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "2.2fr 1fr",
            },
            gap: 2.5,
          }}
        >
          {/* ================= LEFT SIDE ================= */}
          <Card
            variant="outlined"
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(24px)",
              minHeight: 0,
            }}
          >
            {/* TOP BAR */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* LANGUAGE */}
              <Select
                value={language}
                onChange={(e) => {
                  const selectedLanguage = e.target.value;

                  setLanguage(selectedLanguage);

                  socket.emit("language-change", {
                    roomId,
                    language: selectedLanguage,
                  });
                }}
                size="small"
                sx={{
                  minWidth: 180,
                  borderRadius: "10px",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },

                  backdropFilter: "blur(10px)",
                }}
              >
                <MenuItem value="nodejs">JavaScript</MenuItem>

                <MenuItem value="python3">Python</MenuItem>

                <MenuItem value="java">Java</MenuItem>

                <MenuItem value="cpp17">C++</MenuItem>
              </Select>

              {/* RUN BUTTON */}
              <Button
                variant="contained"
                color="success"
                onClick={runCode}
                disabled={running}
                sx={{
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                {running ? "Running..." : "Run Code"}
              </Button>
            </Box>

            {/* EDITOR */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <Editor
                height="100%"
                language={
                  language === "nodejs"
                    ? "javascript"
                    : language === "python3"
                      ? "python"
                      : language === "cpp17"
                        ? "cpp"
                        : "java"
                }
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 15,
                  minimap: {
                    enabled: false,
                  },
                  padding: {
                    top: 18,
                  },
                  smoothScrolling: true,
                }}
              />
            </Box>
          </Card>

          {/* ================= RIGHT SIDE ================= */}
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "0.9fr 1.2fr auto",
              gap: 2.5,
              minHeight: 0,
            }}
          >
            {/* OUTPUT */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backdropFilter: "blur(24px)",
                minHeight: 0,
              }}
            >
              {/* HEADER */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Output
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOutput("")}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                  }}
                >
                  Clear
                </Button>
              </Box>

              {/* CONSOLE */}
              <Box
                sx={(theme) => ({
                  flex: 1,
                  p: 2.5,
                  overflowY: "auto",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95rem",

                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.25)"
                      : "rgba(255,255,255,0.5)",
                })}
              >
                {output || "Run your code to see output..."}
              </Box>
            </Card>

            {/* CHAT */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backdropFilter: "blur(24px)",
                minHeight: 0,
              }}
            >
              {/* HEADER */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Chat
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    {onlineUsers} online
                  </Typography>
                </Box>
              </Box>

              {/* MESSAGES */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={(theme) => ({
                      p: 1.5,
                      borderRadius: "12px",

                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",

                      border: "1px solid",
                      borderColor: "divider",
                    })}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                ))}

                {/* AUTO SCROLL TARGET */}
                <div ref={messagesEndRef} />
              </Box>

              {/* INPUT */}
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  gap: 1.5,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Send message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={sendMessage}
                  sx={{
                    borderRadius: "10px",
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                  }}
                >
                  Send
                </Button>
              </Box>
            </Card>

            {/* LEAVE ROOM */}
            <Button
              variant="contained"
              color="error"
              onClick={leaveRoom}
              sx={{
                borderRadius: "10px",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                backdropFilter: "blur(10px)",
              }}
            >
              Leave Room
            </Button>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default EditorRoom;
