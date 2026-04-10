"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/plants", label: "Plants" },
  { href: "/log", label: "Log" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-stone-0/80 border-b border-stone-200">
      <div className="max-w-xl mx-auto px-5 sm:px-6 h-15 flex items-center justify-between">
        <div className="font-heading font-semibold text-stone-800">
          Plantometer
        </div>
        <nav className="flex gap-6 text-sm">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "text-sprout-600 border-b-2 border-sprout-500 pb-1"
                    : "text-stone-500 hover:text-stone-800 transition-colors"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
