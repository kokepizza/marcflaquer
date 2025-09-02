import { useRef, useEffect } from "react";
import "./img-stretch-effect.css";

export default function ImageStretchEffect() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/img/22_250TR.webp";
    imgRef.current = img;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const animateStretch = (expand = true) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    const { width, height } = canvas;

    let progress = expand ? 0 : 1; // 0 → inicio, 1 → fin
    const step = 0.03; // velocidad de animación

    cancelAnimationFrame(animRef.current);

    // columna izquierda (x = 0)
    const column = ctx.getImageData(0, 0, 1, height);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // progreso animado
      progress += expand ? step : -step;
      progress = Math.max(0, Math.min(1, progress));

      const stretchWidth = width * progress; // cuánto ocupa el stretch
      const imgWidth = width * (1 - progress); // ancho restante de la imagen

      // stretch (izquierda)
      if (stretchWidth > 0) {
        const stretched = ctx.createImageData(width, height);
        for (let y = 0; y < height; y++) {
          const r = column.data[y * 4];
          const g = column.data[y * 4 + 1];
          const b = column.data[y * 4 + 2];
          const a = column.data[y * 4 + 3];

          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            stretched.data[idx] = r;
            stretched.data[idx + 1] = g;
            stretched.data[idx + 2] = b;
            stretched.data[idx + 3] = a;
          }
        }
        ctx.putImageData(stretched, 0, 0);
      }

      // imagen comprimida (a la derecha)
      if (imgWidth > 0) {
        ctx.drawImage(
          img,
          0,
          0,
          width,
          height,
          stretchWidth,
          0,
          imgWidth,
          height
        );
      }

      // seguir animando
      if ((expand && progress < 1) || (!expand && progress > 0)) {
        animRef.current = requestAnimationFrame(draw);
      }
    }

    draw();
  };

  return (
    <div className="image-stretch-wrapper">
      <canvas
        ref={canvasRef}
        className="image-stretch-canvas"
        onMouseEnter={() => animateStretch(true)}
        onMouseLeave={() => animateStretch(false)}
      />
    </div>
  );
}