import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chat from "./Chat";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSpinner from "./Spinner";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  const baseUrl =
    "https://w2r678gxwd.execute-api.us-east-1.amazonaws.com/prod/";
  const [history, setHistory]: any = useState([]);
  const [question, setQuestion] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [sessionId, setSessionId] = useState(undefined);

  const handleSendQuestion = () => {
    setSpinner(true);

    fetch(baseUrl + "docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-amzn-trace-id": "Root=1-5f107f3e-8b9c3b3b5f1b9b1b1b1b1b1b",
      },
      body: JSON.stringify({
        requestSessionId: sessionId,
        question: question,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSpinner(false);
        setSessionId(data.sessionId);
        setHistory([
          ...history,
          {
            question: question,
            response: data.response,
            citation: data.citation,
          },
        ]);
      })
      .catch((err) => {
        console.error(err);
        setSpinner(false);
        setHistory([
          ...history,
          {
            question: question,
            response:
              "Error generating an answer. Please check your browser console, WAF configuration, Bedrock model access, and Lambda logs for debugging the error.",
            citation: undefined,
          },
        ]);
      });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSendQuestion();
    }
  };

  const onClearHistory = () => setHistory([]);

  return (
    <Authenticator hideSignUp>
      {({ signOut }) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "30px",
          }}
        >
          <Paper
            sx={{
              padding: 8,
              maxWidth: "100%",
              width: "50%",
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Juridico Q&A
            </Typography>
            <br></br>
            <br></br>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "10px",
                  paddingTop: "20px",
                }}
              >
                <Typography variant="overline">
                  Pergunte aos seus documentos:
                </Typography>
              </Box>
              <Chat history={history} />
              <br></br>
              {spinner ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <LoadingSpinner />
                </Box>
              ) : (
                <br></br>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "20px",
                paddingTop: "20px",
              }}
            >
              <TextField
                disabled={spinner || !baseUrl}
                variant="standard"
                label="Escreva sua questão aqui"
                value={question}
                onChange={(e) => setQuestion(e.target?.value)}
                onKeyDown={handleKeyDown}
                sx={{ width: "95%" }}
              />
              <IconButton
                disabled={spinner || !baseUrl}
                onClick={handleSendQuestion}
                color="primary"
              >
                <SendIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "20px",
                paddingTop: "20px",
              }}
            >
              <Button
                disabled={history.length === 0}
                startIcon={<DeleteIcon />}
                onClick={onClearHistory}
              >
                Limpar histórico
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "20px",
                paddingTop: "20px",
              }}
            >
              <button onClick={signOut}>Deslogar</button>
            </Box>
          </Paper>
        </Box>
      )}
    </Authenticator>
  );
}

export default App;
