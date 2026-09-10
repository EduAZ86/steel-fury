import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { DemoSection } from "@/components/landing/DemoSection";
import { CodeSection } from "@/components/landing/CodeSection";
import { BRAND } from "@/lib/brand";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <Hero />
      <Features />
      <DemoSection />
      <CodeSection />
      <footer className="mt-16 px-6 text-center font-mono text-xs text-gray-600">
        {BRAND.name} · the demo ({BRAND.demoName}) is an instance, not the engine
      </footer>
    </main>
  );
}