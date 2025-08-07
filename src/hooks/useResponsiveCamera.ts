import { useState, useEffect } from "react";

// Mobile detection utility
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
};

// Responsive camera parameters
export const getResponsiveCameraParams = () => {
  const mobile = isMobile();

  return {
    radius: mobile ? 60 : 40, // Larger radius for mobile to zoom out
    height: mobile ? 15 : 10, // Adjust vertical height for mobile
    fov: mobile ? 75 : 40, // Wider FOV for mobile to show more content
    baseScale: mobile ? 0.8 : 1.0, // Scale down watch on mobile
  };
};

// Hook for responsive camera management
export const useResponsiveCamera = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [cameraParams, setCameraParams] = useState(getResponsiveCameraParams());

  useEffect(() => {
    const updateResponsiveParams = () => {
      const mobile = isMobile();
      setIsMobileDevice(mobile);
      setCameraParams(getResponsiveCameraParams());

      if (process.env.NODE_ENV === "development") {
        console.log(
          `📱 Responsive camera update: ${
            mobile ? "Mobile" : "Desktop"
          } | FOV: ${cameraParams.fov} | Radius: ${cameraParams.radius}`
        );
      }
    };

    // Initial update
    updateResponsiveParams();

    // Handle window resize
    const handleResize = () => {
      updateResponsiveParams();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobileDevice,
    cameraParams,
    updateCamera: () => setCameraParams(getResponsiveCameraParams()),
  };
};
