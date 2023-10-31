import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import _ from "lodash";
import "./style.css";

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.3;

export default (props) => {
  const { imageSrc, centerX } = props;

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [heightScale, setHeightScale] = useState(1);
  const containerRef = useRef();
  const canvasRef = useRef();
  const observer = useRef();
  const touch = useRef({ x: 0, y: 0 });

  const image = useMemo(() => new Image(), [imageSrc]);

  useEffect(() => {
    if (!containerRef?.current) return;

    observer.current = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        if (!canvasRef?.current) return;

        const { width, height } = image;

        const canvasScale = target.clientWidth / canvasRef.current.width;
        canvasRef.current.width = canvasRef.current.width * canvasScale;
        canvasRef.current.height = canvasRef.current.height * canvasScale;

        let scale = 1;

        if (target.clientHeight > height) {
          scale = containerRef.current.clientHeight / height;
          setHeightScale(scale);
        }

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        const x = (width * centerX) / 100 - canvasRef.current.width / 2;
        const y = (canvasRef.current.height / scale - height) / 2;

        canvasRef.current.getContext("2d").drawImage(
          image,
          0,
          0,
          width,
          height,
          x,
          y,

          scaledWidth,
          scaledHeight,
        );
      });
    });
    observer.current.observe(containerRef.current);

    return () => {
      if (!observer?.current) return;
      if (!containerRef?.current) return;
      observer.current.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!containerRef?.current) return;
    if (!canvasRef?.current) return;

    image.src = imageSrc;

    image.onload = () => {
      const { width, height } = image;

      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;

      const scale = containerRef.current.clientHeight / height;
      setHeightScale(scale);

      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      const { x, y } = countCenter(scaledWidth);

      canvasRef.current
        .getContext("2d")
        .drawImage(image, 0, 0, width, height, x, y, scaledWidth, scaledHeight);
    };
  }, [image]);

  useEffect(() => {
    draw();
  }, [zoom, centerX, offset]);

  const countCenter = (scaledWidth) => {
    const canvasWidth = canvasRef.current.width;
    let x = -(scaledWidth * (centerX / 100) - canvasWidth / 2);

    if (canvasWidth > scaledWidth) {
      x = canvasWidth / 2 - scaledWidth * (centerX / 100);
    }

    return { x, y: 0 };
  };

  const draw = () => {
    if (!canvasRef.current) return;

    const { width, height } = canvasRef.current;
    const { width: imageWidth, height: imageHeight } = image;
    const context = canvasRef.current.getContext("2d");

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    context.translate(-offset.x, -offset.y);
    context.scale(zoom, zoom);
    context.clearRect(0, 0, width, height);

    const scaledWidth = imageWidth * heightScale * zoom;
    const scaledHeight = imageHeight * heightScale * zoom;

    let { x, y } = countCenter(imageWidth * heightScale);

    x = x / zoom;
    y = y / zoom;

    x += (context.canvas.width / zoom - width) / 2;
    y += (context.canvas.height / zoom - height) / 2;

    context.drawImage(
      image,
      0,
      0,
      imageWidth,
      imageHeight,
      x,
      y,
      scaledWidth,
      scaledHeight,
    );
  };

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    const { deltaY } = e;
    setZoom((zoom) => {
      return _.clamp(
        zoom + deltaY * SCROLL_SENSITIVITY * -1,
        MIN_ZOOM,
        MAX_ZOOM,
      );
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);

    const { clientX, clientY } = e;

    touch.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const hangleMouseMove = (e) => {
    if (!isDragging) return;

    const { x, y } = touch.current;
    const { clientX, clientY } = e;

    setOffset({
      x: offset.x + (x - clientX),
      y: offset.y + (y - clientY),
    });

    touch.current = { x: clientX, y: clientY };
  };

  return (
    <>
      <Box className="image-box">
        <div ref={containerRef} className="full-height">
          <canvas
            style={{ border: "1px solid black" }}
            className="full-height"
            ref={canvasRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={hangleMouseMove}
          />
        </div>
      </Box>
      <Box className="tool-box">
        <Tooltip title="Reset">
          <IconButton onClick={reset}>
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};
