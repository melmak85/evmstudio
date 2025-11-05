"use client";

import { useState, useEffect } from "react";

export interface KeyboardControls {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  space: boolean;
}

export function useKeyboardControls(): KeyboardControls {
  const [keys, setKeys] = useState<KeyboardControls>({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") {
        setKeys((prev) => ({ ...prev, [key]: true }));
      }
      if (key === " " || event.code === "Space") {
        event.preventDefault(); // Evitar scroll de página
        setKeys((prev) => ({ ...prev, space: true }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") {
        setKeys((prev) => ({ ...prev, [key]: false }));
      }
      if (key === " " || event.code === "Space") {
        setKeys((prev) => ({ ...prev, space: false }));
      }
    };

    // Agregar event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}

