import React from "react";
import { useState, useEffect } from "react";

interface SlideWrapperProps {
  children: React.ReactNode;
}
const SlideWrapper = ({ children }: SlideWrapperProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("");
  const [showDots, setShowDots] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetDotsTimer = () => {
      setShowDots(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowDots(false);
      }, 1000);
    };

    interface KeyboardEvent {
      key: string;
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isTransitioning) return;
      resetDotsTimer();

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (currentSlide < React.Children.count(children) - 1) {
          setTransitionDirection("next");
          setIsTransitioning(true);
          setTimeout(() => {
            setTimeout(() => setIsTransitioning(false), 600);
            setCurrentSlide((prev: number) => prev + 1);
          }, 300);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (currentSlide > 0) {
          setTransitionDirection("prev");
          setIsTransitioning(true);
          setTimeout(() => {
            setTimeout(() => setIsTransitioning(false), 600);
            setCurrentSlide((prev: number) => prev - 1);
          }, 300);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    resetDotsTimer(); // Initialize timer when component mounts

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer); // Cleanup timer on unmount
    };
  }, [currentSlide, isTransitioning, children]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center">
        {React.Children.map(children, (child, index) => {
          let translateY = "100%";
          let scale = "0.8";
          let opacity = "0";
          let zIndex = "0";

          if (index === currentSlide) {
            translateY = "0";
            scale = isTransitioning ? "0.8" : "1";
            opacity = "1";
            zIndex = "10";
          } else if (
            index === currentSlide + 1 &&
            transitionDirection === "next"
          ) {
            translateY = isTransitioning ? "0" : "100%";
            scale = isTransitioning ? "1" : "0.8";
            opacity = isTransitioning ? "1" : "0";
            zIndex = "5";
          } else if (
            index === currentSlide - 1 &&
            transitionDirection === "prev"
          ) {
            translateY = isTransitioning ? "0" : "-100%";
            scale = isTransitioning ? "1" : "0.8";
            opacity = isTransitioning ? "1" : "0";
            zIndex = "5";
          }

          return (
            <div
              className="absolute w-full h-full transition-all duration-600"
              style={{
                transform: `translateY(${translateY}) scale(${scale})`,
                opacity,
                zIndex,
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {child}
            </div>
          );
        })}
      </div>

      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-opacity duration-300 ${
          showDots ? "opacity-100" : "opacity-0"
        }`}
      >
        {React.Children.map(children, (_, index) => (
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentSlide ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideWrapper;
