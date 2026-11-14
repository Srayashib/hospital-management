import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export const HOSPITAL = {
  name: "CareNest Hospital",
  emergency: "108",
  phone: "+91 98765 43210",
  email: "care@carenest.example",
};


const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#departments", label: "Departments" },
  { href: "#doctors", label: "Doctors" },
  { href: "#contact", label: "Contact" },
];


export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className={`hdr ${scrolled ? "is-scrolled" : ""}`}>
      <div className="hdr-util">
        <div className="wrap hdr-util-in">
          <span>Emergency desk open 24 hours</span>
          <a href={`tel:${HOSPITAL.emergency}`} className="hdr-sos">
            Call {HOSPITAL.emergency}
          </a>
        </div>
      </div>

      <div className="wrap hdr-main">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="var(--teal)" />
            <path d="M16 7v18M7 16h18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span>{HOSPITAL.name}</span>
        </Link>

        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        
<nav id="nav" className={`nav ${open ? "is-open" : ""}`}>
  {links.map((l) => (
    <a
      key={l.label}
      href={l.href}
      onClick={() => setOpen(false)}
    >
      {l.label}
    </a>
  ))}

  <div className="nav-cta">
    <Link
      to="/login"
      className="btn btn-ghost"
      onClick={() => setOpen(false)}
    >
      Sign in
    </Link>

    <Link
      to="/register"
      className="btn btn-solid"
      onClick={() => setOpen(false)}
    >
      Register
    </Link>
  </div>
</nav>

      </div>
    </header>
  );
}
