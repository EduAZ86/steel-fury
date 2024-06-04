'use client'
import { MainLoop } from "@/core/MainLoop/mainLoop.class";
import { ScreenSize } from "@/core/Screen/screenSize.class";
import { useEffect } from "react";


// const Loop = new MainLoop()
// Loop.iteration()
const Screen = new ScreenSize()
Screen.start()

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span>

      </span>
    </main>
  );
}
