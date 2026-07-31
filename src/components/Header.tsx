import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center">
          <Image
            src="/nlc.png"
            alt="Next Level Solutions Campus"
            width={190}
            height={190}
            className="h-11 w-11 object-contain sm:h-14 sm:w-14"
            priority
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-nlsc-text transition-colors hover:text-nlsc-green"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#portal"
          className="rounded-lg bg-nlsc-text px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Student portal
        </a>
      </div>
    </header>
  );
}
