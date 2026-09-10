import { TankDemo } from "../demo/TankDemo";
import { BRAND } from "@/lib/brand";

export function DemoSection() {
  return (
    <section className="px-6 py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Try it now
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          {BRAND.demoName} running inside a real instance of {BRAND.name}. Hit{" "}
          <span className="font-mono text-[#fbbf24]">START</span> to begin.
        </p>
      </div>
      <TankDemo />
    </section>
  );
}