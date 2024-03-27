import React from "react";
import { SparklesCore } from "./sparklesCore";

export function SparklesPreview() {
  return (
    <div className="py-4 px-2 bg-transparent flex flex-col items-center justify-center rounded-md">
  <h1 className="text-3xl font-bold text-center text-white relative top-12 z-20">
    Kapier
  </h1>
  <div className="w-full relative h-[6vh]">
    {/* Core component */}
    <SparklesCore
      background="transparent"
      minSize={0.4}
      maxSize={1}
      particleDensity={1200}
      className="w-full h-full"
      particleColor="#FFFFFF"
    />
  </div>
</div>

  );
}
