"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const banners = [1, 2, 3, 4];

export default function BannerSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((x) => (x + 1) % banners.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-slider">
      {banners.map((number, index) => (
        <Link
          key={number}
          href="/courses"
          className={`banner-slide${active === index ? " active" : ""}`}
          style={{ backgroundImage: `url('/assets/banners/banner${number}.jpg')` }}
        />
      ))}
      <div className="banner-dots">
        {banners.map((number, index) => (
          <button key={number} type="button" className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-label={`Banner ${number}`} />
        ))}
      </div>
    </div>
  );
}
