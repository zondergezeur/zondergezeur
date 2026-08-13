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
          <a href={item.href} key={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
