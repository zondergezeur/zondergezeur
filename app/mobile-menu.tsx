"use client";

import { useRef } from "react";

const navItems = [
  { href: "#websites", label: "Websites" },
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#voorbeeld", label: "Voorbeeld" },
  { href: "#prijzen", label: "Prijzen" },
  { href: "#vragen", label: "Vragen" },
  { href: "#contact", label: "Contact" },
];

function scrollToSection(href: string) {
  const target = document.querySelector<HTMLElement>(href);

  if (!target) {
    return;
  }

  const header = document.querySelector<HTMLElement>(".site-header");
  const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
  const isMobile = window.matchMedia("(max-width: 880px)").matches;
  const gap = isMobile && href === "#voorbeeld" ? 72 : isMobile ? 10 : 14;
  const top = target.getBoundingClientRect().top + window.scrollY - headerBottom - gap;

  window.history.pushState(null, "", href);
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function DesktopNav() {
  return (
    <nav className="top-nav" aria-label="Hoofdnavigatie">
      {navItems.map((item) => (
        <a
          href={item.href}
          key={item.href}
          onClick={(event) => {
            event.preventDefault();
            scrollToSection(item.href);
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function MobileMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }

  return (
    <details className="mobile-menu" ref={menuRef}>
      <summary aria-label="Open menu">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </summary>
      <nav aria-label="Mobiele navigatie">
        {navItems.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onClick={(event) => {
              event.preventDefault();
              closeMenu();
              scrollToSection(item.href);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
