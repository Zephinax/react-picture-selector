import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2 flex justify-center items-center min-h-[180px] bg-gray-300/30 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xs bg-opacity-30">
      {children}
    </div>
  );
}
