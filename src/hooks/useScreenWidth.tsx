"use client";

import { useEffect, useState } from 'react';

export function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update screenWidth when the window is resized
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Attach event listener for window resize
    window.addEventListener('resize', updateScreenWidth);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []); // Empty dependency array ensures this effect runs only once after component mount

  return { screenWidth };
}