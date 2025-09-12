import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * @param {number} breakpoint - The width in pixels below which is considered mobile (default: 768px)
 * @returns {boolean} - True if viewport width is less than the breakpoint
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [breakpoint]);

  return isMobile;
};
