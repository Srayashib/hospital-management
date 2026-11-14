import { useState } from "react";
import { Link } from "react-router-dom";
import { HOSPITAL } from "./Header";

const footerLinks = {
  "Quick Links": [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About Us" },
    { href: "/#services", label: "Our Services" },
    { href: "/#departments", label: "Departments" },
  ],
  "Our Hospital": [
    { href: "/#doctors", label: "Our Doctors" },
    { href: "/#portals", label: "Patient & Staff Portals" },
    { href: "/#contact", label: "Contact Us" },
    { href: "/login", label: "Sign In" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setDone(true);
    setEmail("");
  };

  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div className="ftr-about">
          <h3>{HOSPITAL.name}</h3>

          <p>
            Your trusted healthcare partner. We provide quality medical
            services, expert doctors, and compassionate care for every patient.
          </p>

          <form onSubmit={subscribe} className="ftr-form">
            <label htmlFor="nl" className="sr">
              Email for health tips
            </label>

            <input
              id="nl"
              type="email"
              placeholder="Your email for health tips"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDone(false);
              }}
              required
            />

            <button type="submit">Subscribe</button>
          </form>

          {done && (
            <p className="ftr-ok" role="status">
              Subscribed. Thank you!
            </p>
          )}
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4>{title}</h4>

            <ul>
              {links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/#") ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <Link to={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div id="contact" className="ftr-contact">
          <h4>Contact Us</h4>

          <address>
            12 Lake Road, Kolkata
            <br />
            West Bengal 700001
          </address>

          <p>
            <strong>Emergency:</strong>{" "}
            <a href={`tel:${HOSPITAL.emergency}`}>
              {HOSPITAL.emergency}
            </a>
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            <a href={`tel:${HOSPITAL.phone.replace(/\s/g, "")}`}>
              {HOSPITAL.phone}
            </a>
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${HOSPITAL.email}`}>
              {HOSPITAL.email}
            </a>
          </p>

          <p className="ftr-hours">
            OPD: 8 AM – 8 PM
            <br />
            Monday to Saturday
          </p>
        </div>
      </div>

      <div className="wrap ftr-base">
        <span>
          © {new Date().getFullYear()} {HOSPITAL.name}. All rights reserved.
        </span>

        <span>
          <Link to="/privacy">Privacy Policy</Link> ·{" "}
          <Link to="/terms">Terms & Conditions</Link>
        </span>
      </div>
    </footer>
  );
}