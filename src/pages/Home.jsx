// // src/pages/Home.jsx
// import Navbar from "../components/Navbar";
// import Carousel from "../components/Carousel";
// import Footer from "../components/Footer";

// // Import images from assets/images folder
// import hero1 from "../assets/images/hero1.jpg";
// import hero2 from "../assets/images/hero2.jpg";
// import hero3 from "../assets/images/hero3.jpg";

// export default function Home() {
//   const images = [hero1, hero2, hero3];

//   return (
//     <div>
//       {/* Navbar */}
//       <Navbar />

//       <header className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <h1 className="text-4xl md:text-5xl font-extrabold">
//             Welcome to Nebulytix Technology
//           </h1>
//           <p className="text-gray-600 mt-3">
//             Innovating cloud solutions for modern businesses.
//           </p>
//         </div>

//         <div className="mt-8">
//           <Carousel images={images} />
//         </div>

//         <section className="mt-12 bg-white rounded-lg p-6 shadow">
//           <h2 className="text-2xl font-semibold">Who We Are</h2>
//           <p className="mt-3 text-gray-700">
//             Nebulytix Technology is a fast-growing software company focused on
//             building scalable cloud and web solutions. We value innovation,
//             collaboration, and continuous learning.
//           </p>
//         </section>
//       </header>

//       <Footer />
//     </div>
//   );
// }

// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

import hero1 from "../assets/images/hero1.jpg";
import hero2 from "../assets/images/hero2.jpg";
import hero3 from "../assets/images/hero3.jpg";

export default function Home() {
  const images = [hero1, hero2, hero3];

  return (
    <div className="bg-gray-50 text-gray-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Empowering Businesses with Cloud & Digital Innovation
        </h1>

        <p className="text-xl mt-4 max-w-2xl mx-auto opacity-90">
          Nebulytix Technology builds scalable, cloud-first, enterprise-grade software solutions for modern business needs.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
            Get Started
          </button>
          <button className="px-6 py-3 border border-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition">
            Contact Us
          </button>
        </div>

        <div className="mt-10 shadow-2xl rounded-2xl overflow-hidden border border-blue-200">
          <Carousel images={images} />
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center">Our Services</h2>
        <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
          We provide cutting-edge cloud and development services to help businesses scale efficiently.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Cloud Solutions", desc: "AWS, Azure, GCP architecture and deployment." },
            { title: "Web App Development", desc: "Modern, scalable front-end & back-end solutions." },
            { title: "Automation & AI", desc: "Automate workflows with AI-driven efficiency." },
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition border">
              <h3 className="text-2xl font-bold mb-2 text-blue-700">{s.title}</h3>
              <p className="text-gray-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">Why Choose Us</h2>
          <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
            We deliver next-gen technology with precision, performance, and reliability.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Fast Delivery",
              "Secure Architecture",
              "Scalable Engineering",
              "24/7 Support",
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl shadow border hover:shadow-lg transition text-center">
                <h3 className="font-bold text-xl">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          {[
            { value: "40+", label: "Projects Delivered" },
            { value: "25+", label: "Clients Served" },
            { value: "5+", label: "Years Experience" },
            { value: "99.9%", label: "Uptime Guarantee" },
          ].map((m, i) => (
            <div key={i}>
              <h3 className="text-5xl font-extrabold">{m.value}</h3>
              <p className="text-xl mt-2 opacity-90">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center">What Our Clients Say</h2>
        <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
          Trusted by organizations across industries.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Amit Sharma", feedback: "Outstanding team! Delivered our cloud migration ahead of schedule." },
            { name: "Sara Williams", feedback: "Professional, reliable, and extremely skilled." },
            { name: "Rajesh Kumar", feedback: "Our web platform performance improved dramatically." },
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border">
              <p className="text-gray-700 italic">“{t.feedback}”</p>
              <h3 className="font-bold text-blue-700 mt-4">{t.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 text-center">
        <h2 className="text-4xl font-bold">Ready to Build Something Amazing?</h2>
        <p className="mt-3 text-xl opacity-90">Let’s collaborate and bring your idea to life.</p>
        <button className="mt-6 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow hover:bg-gray-100 transition">
          Get in Touch
        </button>
      </section>

      <Footer />
    </div>
  );
}