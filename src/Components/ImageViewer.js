import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Slider } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import _, { entries } from "lodash";

const CELL_NUMBER = 10;
const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.3;

export default (props) => {
  const { imagePath } = props;

  const [zoom, setZoom] = useState(1);
  const containerRef = useRef();
  const canvasRef = useRef();
  const observer = useRef();

  const image = useMemo(() => new Image(), [imagePath]);

  useEffect(() => {
    if (!containerRef.current) return;

    observer.current = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const { width, height } = image;

        if (target.clientWidth < width) {
          const scale = target.clientWidth / width;

          const scaledWidth = width * scale;
          const scaledHeight = height * scale;

          canvasRef.current.width = scaledWidth;
          canvasRef.current.height = scaledHeight;

          canvasRef.current
            .getContext("2d")
            .drawImage(image, 0, 0, scaledWidth, scaledHeight);
        }
      });
    });
    observer.current.observe(containerRef.current);

    return () => observer.current.unobserve(containerRef.current);
  }, []);

  useEffect(() => {
    if (!canvasRef?.current) return;

    image.src = imagePath;

    image.onload = () => {
      const { width, height } = image;
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      canvasRef.current.getContext("2d").drawImage(image, 0, 0);
    };
  }, [image]);

  useEffect(() => {
    draw();
  }, [zoom]);

  const handleWheel = (e) => {
    e.preventDefault();

    const { deltaY } = e;
    setZoom((zoom) => {
      console.log("execute zoom");
      return _.clamp(
        zoom + deltaY * SCROLL_SENSITIVITY * -1,
        MIN_ZOOM,
        MAX_ZOOM,
      );
    });
  };

  const draw = () => {
    if (!canvasRef.current) return;

    const { width, height } = canvasRef.current;
    const context = canvasRef.current.getContext("2d");

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    context.scale(zoom, zoom);
    context.clearRect(0, 0, width, height);

    const x = (context.canvas.width / zoom - image.width) / 2;
    const y = (context.canvas.height / zoom - image.height) / 2;

    context.drawImage(image, x, y);
  };

  return (
    <>
      <div ref={containerRef}>
        <canvas ref={canvasRef} onWheel={handleWheel} />
      </div>
    </>
  );
};
