import { Box } from "@mui/material";
import "./App.css";
import LongImageViewer from "./Components/LongImageViewer";

function App() {
  return (
    <div className="App">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <LongImageViewer imagePath="/long1.png" />
      </Box>
    </div>
  );
}

export default App;
