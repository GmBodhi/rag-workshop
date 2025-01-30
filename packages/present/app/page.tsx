"use client";

import Slide1 from "@/components/slides/slide1";
import SlideWrapper from "@/components/slideWrapper";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen">
        <SlideWrapper>
          <Slide1 className="bg-white" />
          <Slide1 className="bg-black" />
          <Slide1 className="bg-blue-500" />
          <Slide1 className="bg-yellow-500" />
          <Slide1 className="bg-pink-500" />
        </SlideWrapper>
      </div>
    </>
  );
}
