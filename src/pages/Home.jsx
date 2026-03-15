import { useEffect } from "react";
import Barbers from "../components/Barbers";
import Booking from "../components/Booking";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";

function Home() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -48px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#111111", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Services />
      <Barbers />
      <Pricing />
      <Testimonials />
      <Booking />
      <Footer />
    </div>
  );
}

export default Home;
