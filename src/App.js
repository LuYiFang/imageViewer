import { Box } from "@mui/material";
import "./App.css";
import LongImageViewer from "./Components/LongImageViewer/LongImageViewer";

function App() {
  return (
    <div className="App">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          px: 8,
        }}
      >
        <LongImageViewer imagePath="/long1.png" />
      </Box>
    </div>
  );
}

export default App;
