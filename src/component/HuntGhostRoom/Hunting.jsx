import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ghost_1 from "../../assets/ghost_1.svg";
import ghost_2 from "../../assets/ghost_2.svg";
import ghost_3 from "../../assets/ghost_3.svg";
import ghost_4 from "../../assets/ghost_4.svg";
import logo from "../../assets/logo.svg";
import moon from "../../assets/Frame.svg";
import lang from "../../assets/Lang.svg";
import { ThemeContext } from "../../Hooks/ThemContext";
import Header from "../HomePage/Header/Header";
import './Hunting.css';

const  SpotlightGame =() => {
  const [spot, setSpot] = useState({ x: -9999, y: -9999 });
  const containerRef = useRef();
  const { t, i18n } = useTranslation();
  const { darkMode, setDarkMode, toggleLang } = useContext(ThemeContext);

  const handleMouseMove = (e) => {
    const { left, top } = containerRef.current.getBoundingClientRect();
    setSpot({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  const handleMouseLeave = () => {
    setSpot({ x: -9999, y: -9999 });
  };

  const targets = [
    { style: { top: "130px", left: "50px" }, image: ghost_1 },
    { style: { top: "130px", right: "50px" }, image: ghost_2 },
    { style: { bottom: "130px", left: "50px" }, image: ghost_3 },
    { style: { bottom: "130px", right: "50px" }, image: ghost_4 },
  ];

  const revealRadius = 100;

  return (
    <>
      <Header />
      <div
        ref={containerRef}
        className="spotlight-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {targets.map((t, i) => {
          const ghostX = parseInt(t.style.left || t.style.right, 10);
          const ghostY = parseInt(t.style.top || t.style.bottom, 10);
          const containerRect =
            containerRef.current?.getBoundingClientRect() || {
              width: 0,
              height: 0,
            };

          const x = t.style.left ? ghostX : containerRect.width - ghostX;

          const y = t.style.top ? ghostY : containerRect.height - ghostY;

          const dx = spot.x - x;
          const dy = spot.y - y;
          const dist = Math.hypot(dx, dy);
          const visible = dist < revealRadius;

          return (
            <img
              key={i}
              src={t.image}
              alt={`ghost-${i}`}
              className="ghost-image"
              style={{
                ...t.style,
                opacity: visible ? 1 : 0,
              }}
            />
          );
        })}

        <div
          className="spotlight-overlay"
          style={{
            background: `radial-gradient(circle ${revealRadius}px at ${spot.x}px ${spot.y}px, #2B2D42 0%, #2B2D4200 100%)`,
          }}
        />
      </div>
    </>
  );
}

export default SpotlightGame