import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ChatInterface from "./components/ChatInterface/ChatInterface";
import BotLauncher from "./components/BotLauncher/BotLauncher";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0a0a0f", paper: "#13131f" },
    primary: { main: "#ff4081" },
    secondary: { main: "#00e5ff" },
  },
  typography: {
    fontFamily: "'Syne', sans-serif",
    h1: { fontFamily: "'Syne Mono', monospace", letterSpacing: "-0.03em" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

export default function App() {
  const [persona, setPersona] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleSelect = (selectedPersona, newSessionId) => {
    setPersona(selectedPersona);
    setSessionId(newSessionId);
  };

  const handleReset = () => {
    setPersona(null);
    setSessionId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&display=swap"
        rel="stylesheet"
      />
      {persona && sessionId ? (
        <ChatInterface persona={persona} sessionId={sessionId} onReset={handleReset} />
      ) : (
        <BotLauncher onSelect={handleSelect} />
      )}
    </ThemeProvider>
  );
}