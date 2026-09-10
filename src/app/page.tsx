import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { GameLauncher } from "@/components/launcher/GameLauncher";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Hero />
      <Features />
      <GameLauncher />
      <Footer />
    </main>
  );
}