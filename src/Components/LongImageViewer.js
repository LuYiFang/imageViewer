import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRef, useState } from "react";
import ImageViewer from "./ImageViewer";
import UploadBox from "./UploadBox/UploadBox";
import { Delete, DeleteForever } from "@mui/icons-material";

export default (props) => {
  const [imageSrc, setImageSrc] = useState();
  const [centerPosition, setCenterPosition] = useState(50);

  const uploadBoxRef = useRef();

  const handleChange = (e, v) => {
    setCenterPosition(v);
  };

  const clearImage = () => {
    uploadBoxRef?.current?.clear();
    setImageSrc(null);
  };

  const onFileUpdate = (image) => {
    setImageSrc(URL.createObjectURL(image));
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Tooltip title="Clear">
          <IconButton onClick={clearImage}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid2 container>
        <Grid2 xs={12} sx={{ mb: 2, width: "100vw" }}>
          <Box sx={{ px: "40px", position: "relative", height: "60vh" }}>
            {imageSrc ? (
              <ImageViewer imageSrc={imageSrc} centerX={centerPosition} />
            ) : (
              <UploadBox ref={uploadBoxRef} onFileUpdate={onFileUpdate} />
            )}
          </Box>
        </Grid2>
        <Grid2 xs={12}>
          <img
            style={{
              height: "100%",
              maxHeight: 64,
            }}
            src={imageSrc}
          />
        </Grid2>
        <Grid2 xs={12}>
          <Slider value={centerPosition} onChange={handleChange} />
        </Grid2>
      </Grid2>
    </>
  );
};
