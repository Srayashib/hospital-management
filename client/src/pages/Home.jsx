import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getDoctors } from "../services/doctorservice";
import "./home.css";
import heroImage from "../assets/19293.jpg";

const DEPARTMENTS = [
  { name: "Cardiology", icon: "❤", text: "ECG, echo, stress tests and heart clinics." },
  { name: "Neurology", icon: "🧠", text: "Headache, stroke and epilepsy care." },
  { name: "Orthopedics", icon: "🦴", text: "Joints, fractures and sports injuries." },
  { name: "Pediatrics", icon: "🧸", text: "Newborn to teen care and vaccination." },
  { name: "Gynecology", icon: "🌸", text: "Maternity, scans and women's health." },
  { name: "Radiology", icon: "🩻", text: "X-ray, CT, MRI and ultrasound." },
  { name: "Pathology", icon: "🧪", text: "Blood and urine tests with online reports." },
  { name: "General Medicine", icon: "🩺", text: "Fever, diabetes, BP and routine checkups." },
];

const PORTALS = {
  Patient: {
    points: ["Book and reschedule visits", "See prescriptions and lab reports", "Pay bills online"],
    to: "/login?role=patient",
  },
  Doctor: {
    points: ["Today's queue at a glance", "Write prescriptions and notes", "Review patient history"],
    to: "/login?role=doctor",
  },
  Reception: {
    points: ["Register walk-ins in seconds", "Manage doctor schedules", "Print tokens and invoices"],
    to: "/login?role=reception",
  },
  Admin: {
    points: ["Staff, wards and beds", "Revenue and visit reports", "Role-based access control"],
    to: "/login?role=admin",
  },
};

const STATS = [
  { value: 120, suffix: "+", label: "Doctors on staff" },
  { value: 350, suffix: "", label: "Beds across wards" },
  { value: 45000, suffix: "+", label: "Patients treated each year" },
  { value: 24, suffix: "h", label: "Emergency and ICU cover" },
];

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Counter({ value, suffix, run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setN(value);
    let raf, start;
    const tick = (t) => {
      start ??= t;
      const p = Math.min((t - start) / 1200, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return <>{n.toLocaleString("en-IN")}{suffix}</>;
}

function BookingCard() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name: "", phone: "", department: "", date: "" });
  const [state, setState] = useState({ status: "idle", msg: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading", msg: "" });
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setState({ status: "ok", msg: "Request sent. Our desk will call you to confirm the time." });
      setForm({ name: "", phone: "", department: "", date: "" });
    } catch {
      setState({ status: "err", msg: "We could not send your request. Check your connection and try again." });
    }
  };

  return (
    <form className="book" id="book" onSubmit={submit}>
      <h2>Request an appointment</h2>
      <p className="book-sub">No account needed. We confirm by phone.</p>

      <label>Full name
        <input value={form.name} onChange={set("name")} required autoComplete="name" />
      </label>
      <label>Phone number
        <input value={form.phone} onChange={set("phone")} required inputMode="tel" pattern="[0-9+\s-]{10,15}" autoComplete="tel" />
      </label>
      <div className="book-row">
        <label>Department
          <select value={form.department} onChange={set("department")} required>
            <option value="">Choose</option>
            {DEPARTMENTS.map((d) => <option key={d.name}>{d.name}</option>)}
          </select>
        </label>
        <label>Preferred date
          <input type="date" min={today} value={form.date} onChange={set("date")} required />
        </label>
      </div>

      <button className="btn btn-solid btn-block" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Sending…" : "Request appointment"}
      </button>
      {state.msg && <p className={`book-msg ${state.status}`} role="status">{state.msg}</p>}
    </form>
  );
}



function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch doctors from MongoDB through your API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const response = await getDoctors();

        // Support common API response formats
        const doctorList = Array.isArray(response)
          ? response
          : response.doctors ||
            response.data ||
            [];

        setDoctors(doctorList);
        setError("");
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Create groups of 4 doctors
  const slides = [];

  for (let i = 0; i < doctors.length; i += 4) {
    slides.push(doctors.slice(i, i + 4));
  }

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Reset slide when doctor list changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [doctors.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      (prev - 1 + slides.length) % slides.length
    );
  };

  // Image path helper
 const API_IMAGE_URL = "http://localhost:5000";

const getDoctorImage = (doctor) => {
  const image = doctor.image;

  if (!image) {
    return "/images/doctor-placeholder.png";
  }

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Remove leading slash
  const imageName = image.replace(/^\/+/, "");

  // Image filename only, e.g. 1785149210355-18825.jpg
  if (!imageName.includes("/")) {
    return `${API_IMAGE_URL}/uploads/doctors/${imageName}`;
  }

  // Image path already contains uploads/doctors
  if (imageName.startsWith("uploads/")) {
    return `${API_IMAGE_URL}/${imageName}`;
  }

  // Image path contains doctors/
  if (imageName.startsWith("doctors/")) {
    return `${API_IMAGE_URL}/uploads/${imageName}`;
  }

  return `${API_IMAGE_URL}/uploads/doctors/${imageName}`;
};
  // Loading
  if (loading) {
    return (
      <section className="sec" id="doctors">
        <div className="wrap section-center">
          <span className="section-label">
            OUR MEDICAL TEAM
          </span>

          <h2 className="sec-h">Meet Our Specialists</h2>

          <p className="doctor-loading">
            Loading doctors...
          </p>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="sec" id="doctors">
        <div className="wrap section-center">
          <h2 className="sec-h">Meet Our Specialists</h2>

          <p className="doctor-error">{error}</p>
        </div>
      </section>
    );
  }

  // Empty list
  if (doctors.length === 0) {
    return (
      <section className="sec" id="doctors">
        <div className="wrap section-center">
          <span className="section-label">
            OUR MEDICAL TEAM
          </span>

          <h2 className="sec-h">Meet Our Specialists</h2>

          <p>No doctors are currently available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sec" id="doctors">
      <div className="wrap">

        {/* Heading */}
        <div className="section-center">
          <span className="section-label">
            OUR MEDICAL TEAM
          </span>

          <h2 className="sec-h">
            Meet Our Specialists
          </h2>

          <p className="sec-p">
            Experienced doctors dedicated to your health.
          </p>
        </div>

        {/* Carousel */}
        <div className="doctor-carousel">

          {/* Previous Button */}
          {slides.length > 1 && (
            <button
              className="doctor-arrow doctor-prev"
              onClick={prevSlide}
              aria-label="Previous doctors"
              type="button"
            >
              &#10094;
            </button>
          )}

          {/* Slides */}
          <div className="doctor-carousel-viewport">
            <div
              className="doctor-carousel-track"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  className="doctor-carousel-slide"
                  key={slideIndex}
                >
                  <div className="doctor-grid">
                    {slide.map((doctor) => (
                      <div
                        className="doctor-card"
                        key={doctor._id || doctor.id}
                      >
                        <div className="doctor-image">
                          <img
                            src={getDoctorImage(doctor)}
                            alt={doctor.name || "Doctor"}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "/images/doctor-placeholder.png";
                            }}
                          />
                        </div>

                        <div className="doctor-info">
                          <h3>
                            {doctor.name ||
                              doctor.fullName ||
                              "Doctor"}
                          </h3>

                          <p className="doctor-specialty">
                            {doctor.specialization ||
                              doctor.specialty ||
                              doctor.department?.name ||
                              doctor.department ||
                              "Medical Specialist"}
                          </p>

                          <span>
                            {doctor.experience ||
                              doctor.experienceYears ||
                              doctor.yearsOfExperience
                              ? `${doctor.experience ||
                                  doctor.experienceYears ||
                                  doctor.yearsOfExperience} ${
                                  typeof (
                                    doctor.experience ||
                                    doctor.experienceYears ||
                                    doctor.yearsOfExperience
                                  ) === "number"
                                    ? "Years Experience"
                                    : ""
                                }`
                              : "Experienced Specialist"}
                          </span>

                          <a
                            href="#book"
                            className="btn btn-solid"
                          >
                            Book Appointment
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {slides.length > 1 && (
            <button
              className="doctor-arrow doctor-next"
              onClick={nextSlide}
              aria-label="Next doctors"
              type="button"
            >
              &#10095;
            </button>
          )}
        </div>

        {/* Carousel Dots */}
        {slides.length > 1 && (
          <div className="doctor-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`doctor-dot ${
                  currentSlide === index ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to doctor slide ${index + 1}`}
                aria-current={
                  currentSlide === index ? "true" : undefined
                }
              />
            ))}
          </div>
        )}

        {/* View All */}
        

      </div>
    </section>
  );
}

export default function Home() {
  const [role, setRole] = useState("Patient");
  const [q, setQ] = useState("");
  const [statsRef, statsSeen] = useInView();

  const filtered = DEPARTMENTS.filter((d) =>
    (d.name + d.text).toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
         <section className="hero"  id="home">
  <div className="wrap hero-in">
    {/* Left: Hero Content */}
    <div className="hero-copy">
      <span className="hero-label">WELCOME TO CareNext Hospital</span>

      <h1>Every visit, report and bill in one record.</h1>

      <p>
        From the front desk to the ward, our team works from the same
        patient file, so you explain your history once and get care sooner.
      </p>

      <div className="hero-actions">
        <a href="#book" className="btn btn-solid">
          Book a visit
        </a>

        <Link to="/login" className="btn btn-ghost">
          Open patient portal
        </Link>
      </div>

      <svg
        className="pulse"
        viewBox="0 0 400 60"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path d="M0 30 H110 L130 30 L145 8 L165 52 L182 18 L196 30 H400" />
      </svg>
    </div>

    {/* Right: Hero Image */}
    <div className="hero-image">
      <img
  src={heroImage}
  alt="Doctor providing professional healthcare"
/>

      <div className="hero-image-badge">
        <span className="hero-badge-icon">+</span>
        <div>
          <strong>Quality Healthcare</strong>
          <p>Care you can trust</p>
        </div>
      </div>
    </div>
  </div>
</section>
        
{/* ABOUT SECTION */}
<section className="sec" id="about">
  <div className="wrap about-grid">
    <div className="about-image">
      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        alt="Modern hospital building"
      />
      <div className="about-badge">
        <strong>20+</strong>
        <span>Years of Healthcare Excellence</span>
      </div>
    </div>

    <div className="about-content">
      <span className="section-label">ABOUT CARENEST</span>

      <h2 className="sec-h">
        Caring for You, Every Step of the Way
      </h2>

      <p>
        CareNest Hospital is committed to providing compassionate,
        advanced, and patient-centered healthcare for every individual.
      </p>

      <p>
        Our experienced medical professionals, modern facilities,
        and integrated healthcare system help ensure a comfortable
        and reliable patient experience.
      </p>

      <ul className="about-list">
        <li>Experienced medical professionals</li>
        <li>Advanced diagnostic facilities</li>
        <li>24/7 emergency services</li>
        <li>Patient-focused healthcare</li>
      </ul>

      <a href="#departments" className="btn btn-solid">
        Explore Departments
      </a>
    </div>
  </div>
</section>

{/* SERVICES SECTION */}
<section className="sec sec-tint" id="services">
  <div className="wrap">
    <div className="section-center">
      <span className="section-label">OUR SERVICES</span>
      <h2 className="sec-h">Healthcare Services</h2>
      <p className="sec-p">
        Comprehensive medical services designed for your health
        and well-being.
      </p>
    </div>

    <div className="service-grid">
      {[
        {
          icon: "📅",
          title: "Online Appointments",
          text: "Book and manage appointments with our specialists.",
        },
        {
          icon: "🧪",
          title: "Laboratory Services",
          text: "Reliable diagnostic testing and medical reports.",
        },
        {
          icon: "💊",
          title: "Pharmacy",
          text: "Access prescribed medications and pharmacy services.",
        },
        {
          icon: "🚑",
          title: "Emergency Care",
          text: "Emergency medical support available around the clock.",
        },
        {
          icon: "🩻",
          title: "Diagnostic Imaging",
          text: "Advanced X-ray, CT, MRI, and ultrasound services.",
        },
        {
          icon: "📋",
          title: "Medical Records",
          text: "Access prescriptions, reports, and medical history.",
        },
      ].map((service) => (
        <div className="service-card" key={service.title}>
          <span className="service-icon">{service.icon}</span>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <a href="#book">Learn More →</a>
        </div>
      ))}
    </div>
  </div>
</section>

{/* DOCTORS SECTION */}
<FeaturedDoctors />

{/* WHY CHOOSE US */}
<section className="sec sec-tint" id="why-us">
  <div className="wrap">
    <div className="section-center">
      <span className="section-label">WHY CARENEST</span>
      <h2 className="sec-h">Why Patients Trust Us</h2>
    </div>

    <div className="why-grid">
      {[
        ["🏥", "Modern Facilities", "Advanced medical technology and well-equipped healthcare facilities."],
        ["👨‍⚕️", "Expert Doctors", "A dedicated team of experienced healthcare professionals."],
        ["❤️", "Patient First", "Personalized care focused on patient comfort and safety."],
        ["⏰", "24/7 Emergency", "Round-the-clock emergency and critical care support."],
      ].map(([icon, title, text]) => (
        <div className="why-card" key={title}>
          <span>{icon}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* TESTIMONIALS */}
<section className="sec" id="testimonials">
  <div className="wrap">
    <div className="section-center">
      <span className="section-label">PATIENT STORIES</span>
      <h2 className="sec-h">What Our Patients Say</h2>
    </div>

    <div className="testimonial-grid">
      {[
        {
          name: "Ananya Sharma",
          text: "The doctors and staff were very supportive. The appointment process was simple and smooth.",
        },
        {
          name: "Rahul Das",
          text: "Excellent care and modern facilities. I had a very comfortable experience.",
        },
        {
          name: "Priya Roy",
          text: "The medical team explained everything clearly and treated me with great care.",
        },
      ].map((review) => (
        <div className="testimonial-card" key={review.name}>
          <div className="stars">★★★★★</div>
          <p>"{review.text}"</p>
          <h3>{review.name}</h3>
          <span>Patient</span>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* STATS */}
        <section className="stats" ref={statsRef} aria-label="Hospital at a glance">
          <div className="wrap stats-in">
            {STATS.map((s) => (
              <div key={s.label}>
                <strong><Counter value={s.value} suffix={s.suffix} run={statsSeen} /></strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PORTALS */}
        {/* <section className="sec" id="portals">
          <div className="wrap">
            <h2 className="sec-h">One system, a view for everyone</h2>
            <p className="sec-p">Pick a role to see what it can do.</p>

            <div className="tabs" role="tablist" aria-label="User roles">
              {Object.keys(PORTALS).map((r) => (
                <button
                  key={r}
                  role="tab"
                  aria-selected={role === r}
                  className={role === r ? "on" : ""}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="panel" role="tabpanel" key={role}>
              <ul>
                {PORTALS[role].points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <Link to={PORTALS[role].to} className="btn btn-solid">Sign in as {role.toLowerCase()}</Link>
            </div>
          </div>
        </section> */}

        {/* DEPARTMENTS */}
        <section className="sec sec-tint" id="departments">
          <div className="wrap">
            <div className="dep-head">
              <div>
                <h2 className="sec-h">Departments</h2>
                <p className="sec-p">Find the right specialty for your symptoms.</p>
              </div>
              <label className="search">
                <span className="sr">Search departments</span>
                <input placeholder="Search, e.g. heart, child" value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
            </div>

            {filtered.length ? (
              <div className="dep-grid">
                {filtered.map((d) => (
                  <a key={d.name} href="#book" className="dep">
                    <span className="dep-ic" aria-hidden="true">{d.icon}</span>
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="empty">No department matches “{q}”. Try a shorter word, or call the desk.</p>
            )}
          </div>
        </section>

        {/* EMERGENCY BAND */}
        <section className="sos">
          <div className="wrap sos-in">
            <div>
              <h2>Emergency? Do not wait for an appointment.</h2>
              <p>Our casualty ward and ICU take patients at any hour.</p>
            </div>
            <a href="tel:108" className="btn btn-sos">Call 108</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
