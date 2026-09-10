import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="font-mono text-sm tracking-[0.3em] text-[#4ade80] uppercase">
            {BRAND.name} <span className="text-gray-500">v{BRAND.version}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{BRAND.tagline}</p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-white">{BRAND.author.name}</p>
          <p className="text-xs text-gray-500">{BRAND.author.role}</p>
        </div>

        <p className="font-mono text-xs text-gray-600">© {BRAND.year}</p>
      </div>
    </footer>
  );
}