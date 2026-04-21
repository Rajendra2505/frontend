import React from "react";
import "./Hero.css";

const carouselImages = [
  { id: 1, src: "/banner.jpg", alt: "Amazon Big India Sale" },
];

export default function HeroCarousel() {
  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-slide active">
          <img src={carouselImages[0].src} alt={carouselImages[0].alt} />
        </div>
      </div>
      <div className="hero-fade"></div>
    </div>
  );
}

