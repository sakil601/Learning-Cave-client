"use client";

import { useEffect, useState } from "react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 450);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className={`floatstack${open ? " open" : ""}`}>
        <a className="fcbtn fc-phone" href="tel:8801629112959" aria-label="Call">☎</a>
        <a className="fcbtn fc-wa" href="https://wa.me/8801629112959" target="_blank" rel="noopener" aria-label="WhatsApp">WA</a>
        <a className="fcbtn fc-fb" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">f</a>
        <button className="fcbtn fc-close" type="button" onClick={() => setOpen((v) => !v)} aria-label="Contact us">☏</button>
      </div>
      <button type="button" className={`scroll-top-btn${showTop ? " show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">↑</button>
    </>
  );
}
