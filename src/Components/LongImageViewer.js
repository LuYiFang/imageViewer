import { Box, Slider } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useCallback, useRef, useState } from "react";
import ImageViewer from "./ImageViewer";

const CELL_NUMBER = 10;

export default (props) => {
  const { imagePath } = props;

  const [centerPosition, setCenterPosition] = useState(50);

  const handleChange = (e, v) => {
    setCenterPosition(v);
  };

  return (
    <>
      <Grid2 container>
        <Grid2 xs={12} sx={{ mb: 2 }}>
          <Box sx={{ px: "40px", position: "relative" }}>
            <ImageViewer imagePath={imagePath} centerX={centerPosition} />
          </Box>
        </Grid2>
        <Grid2 xs={12}>
          <img
            style={{
              width: "100%",
            }}
            src={imagePath}
          />
        </Grid2>
        <Grid2 xs={12}>
          <Slider value={centerPosition} onChange={handleChange} />
        </Grid2>
      </Grid2>
    </>
  );
};
