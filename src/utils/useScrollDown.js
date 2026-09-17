// src/hooks/useScrollDown.js
import { useEffect, useState } from "react";

const useScrollDown = (offset = 40) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > offset);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
};

export default useScrollDown;
