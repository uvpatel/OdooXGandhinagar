import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import NoiseBackgroundDemo from "./noise-background-demo";

export default function BackgroundLinesDemo() {
  return (
    <>
    
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
       AssestFlow 
      </h2>
      <p className="max-w-3xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center leading-relaxed">
  A modern enterprise solution for managing physical assets and shared resources.
  Simplify asset tracking, employee allocations, maintenance requests, resource
  bookings, audits, and analytics with secure role-based workflows.
</p>
<NoiseBackgroundDemo />

    </BackgroundLines>
    
    </>
  );
}
