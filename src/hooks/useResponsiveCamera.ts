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
    radius: mobile ? 34 : 40, // Smaller radius on mobile to bring camera closer
    height: mobile ? 9 : 10, // Slightly lower camera height on mobile
    fov: mobile ? 50 : 40, // Narrower FOV on mobile to avoid zoomed-out look
    baseScale: mobile ? 1.0 : 1.0, // Keep consistent scale across devices
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
