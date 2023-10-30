import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, IconButton, Slider, Typography } from "@mui/material";

import "./style.css";
import { CloudUpload } from "@mui/icons-material";

export default forwardRef((props, ref) => {
  const { onFileUpdate = () => {} } = props;
  const [isUploaded, setIsUploaded] = useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      formRef?.current?.reset();
      setIsUploaded(false);
    },
  }));

  const formRef = useRef();

  const onFileDrag = (e) => {
    e.preventDefault();
    setIsUploaded(true);
  };

  const onFileDragOver = (e) => {
    e.preventDefault();
    setIsUploaded(false);
  };

  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <form
          ref={formRef}
          method="post"
          action=""
          encType="multipart/form-data"
          className="image-upload-form"
          onDragEnter={onFileDrag}
          onDragOver={onFileDrag}
          onDragEnd={onFileDragOver}
          onDragLeave={onFileDragOver}
          onDrop={(e) => {
            onFileDragOver(e);
            onFileUpdate(
              e.dataTransfer.items[0].getAsFile(),
              e.dataTransfer.files[0].name,
            );
          }}
        >
          <div
            className={`image-upload-area ${isUploaded ? "file-uploaded" : ""}`}
          >
            <label htmlFor="upload-image">
              <div className="image-upload-sub-area">
                <div>
                  <CloudUpload
                    className="image-upload-icon"
                    fontSize="large"
                    color={isUploaded ? "action" : "disabled"}
                  />
                  <Typography
                    className="image-upload-text"
                    color={isUploaded ? "textPrimary" : "textSecondary"}
                  >
                    Drag and Drop a file here or click
                  </Typography>
                </div>
              </div>
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              id="upload-image"
              accept="image/*"
              onChange={(e) => {
                onFileUpdate(e.target.files[0], e.target.files[0].name);
              }}
            />
          </div>
        </form>
      </Box>
    </>
  );
});
