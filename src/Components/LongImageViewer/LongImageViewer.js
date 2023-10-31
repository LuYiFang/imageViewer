import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRef, useState } from "react";
import ImageView from "../ImageView/ImageView";
import UploadBox from "../UploadBox/UploadBox";
import { Delete } from "@mui/icons-material";
import "./style.css";

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
    setCenterPosition(50);
  };

  const onFileUpdate = (image) => {
    setImageSrc(URL.createObjectURL(image));
  };

  return (
    <>
      <Box className="clear-box">
        <Tooltip title="Clear">
          <IconButton onClick={clearImage}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid2 container>
        <Grid2 xs={12} className="image-detail">
          <Box className="image-area">
            {imageSrc ? (
              <ImageView imageSrc={imageSrc} centerX={centerPosition} />
            ) : (
              <UploadBox ref={uploadBoxRef} onFileUpdate={onFileUpdate} />
            )}
          </Box>
        </Grid2>
        <Grid2 xs={12} className="slider-area">
          <Box className="slider-box">
            <img className="full-img" src={imageSrc} />
            <Slider value={centerPosition} onChange={handleChange} />
          </Box>
        </Grid2>
      </Grid2>
    </>
  );
};
