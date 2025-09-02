import { useState } from "react";
import "./Gallery.css";

export default function Gallery({ images = [] }) {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="gallery-wrapper">
      {/* Fondo fullscreen */}
      {hoveredImage && (
        <div
          className="fullscreen-bg"
          style={{ backgroundImage: `url(${hoveredImage})` }}
        />
      )}

      {/* Slider en bottom */}
      <div className="thumbnails">
        {images.map((img, index) => (
          <a
            href="#"
            key={index}
            className={`thumbnail ${index === 0 ? "first-thumb" : ""}`}
            onMouseEnter={() => {
              setHoveredImage(img);
              setActiveIndex(index);
            }}
          >
            <img
              src={img}
              alt={`thumb-${index}`}
              className={activeIndex === index ? "active" : ""}
            />
          </a>
        ))}
      </div>
    </div>
  );
}