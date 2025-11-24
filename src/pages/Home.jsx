// Enhanced Home.jsx with high-end animations
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

import hero1 from "../assets/images/hero1.jpg";
import hero2 from "../assets/images/hero2.jpg";
import hero3 from "../assets/images/hero3.jpg";
import NEB1 from "../assets/images/NEB1.jpg";
import NEB2 from "../assets/images/NEB2.jpg";
import NEB3 from "../assets/images/NEB3.jpg";

import {
  Code2,
  Cpu,
  Server,
  Braces,
  Boxes,
  BarChart3
} from "lucide-react";  

import { Search, ClipboardList,  Rocket } from "lucide-react";


import {
  Stethoscope,
  Landmark,
  ShoppingCart,
  Factory,
  Laptop,
  GraduationCap,
  Car,
  Truck
} from "lucide-react";






export default function Home() {
  const images = [hero1, hero2, hero3, NEB1 , NEB2, NEB3];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  };

  return (
    <div className="bg-gray-50 text-gray-900 overflow-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-700 to-blue-900 text-white py-24 px-6 text-center overflow-hidden">
        {/* Floating shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute bottom-10 right-10 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl"
        />

        <motion.h1
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Empowering Businesses with Cloud & Digital Innovation
        </motion.h1>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="text-xl mt-4 max-w-2xl mx-auto opacity-90"
        >
          Nebulytix Technology builds scalable, cloud-first, enterprise-grade
          software solutions for modern business needs.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition"
          >
            Contact Us
          </motion.button>
        </motion.div>

        {/* Hero Carousel */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="show"
          className="mt-10 shadow-2xl rounded-2xl overflow-hidden border border-blue-200"
        >
          <Carousel images={images} />
        </motion.div>
      </section>   




      

      {/* SERVICES */}
      <section className="container mx-auto px-6 py-20">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="text-4xl font-bold text-center"
        >
          Our Services
        </motion.h2>
        <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
          We provide cutting-edge cloud and development services to help
          businesses scale efficiently.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Cloud Solutions",
              desc: "AWS, Azure, GCP architecture and deployment.",
            },
            {
              title: "Web App Development",
              desc: "Modern, scalable front-end & back-end solutions.",
            },
            {
              title: "Automation & AI",
              desc: "Automate workflows with AI-driven efficiency.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-2xl transition border"
            >
              <h3 className="text-2xl font-bold mb-2 text-blue-700">
                {s.title}
              </h3>
              <p className="text-gray-700">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* TECHNOLOGIES */}
<section className="bg-gray-100 py-20">
  <div className="container mx-auto px-6">
    <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="text-4xl font-bold text-center">
      Technologies We Work With
    </motion.h2>

    <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
      We use modern, enterprise-grade technologies to build secure & scalable products.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">

      {[
        "JAVA", "REACT", "Node.js",
     "Python", "DotNet", "AWS",
        "Docker","MongoDB",
        "MySQL", "DATAANALYST"
      ].map((tech, i) => (
        <motion.div
          key={i}
          variants={scaleUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="p-4 bg-white shadow rounded-xl"
        >
          {tech.icon}
          <p className="font-semibold">{tech.name}</p>
        </motion.div>
      ))}

    </div>
  </div>
</section>


{/* INDUSTRIES WE SERVE */}
<section className="bg-white py-20">
  <div className="container mx-auto px-6">
    <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="text-4xl font-bold text-center">
      Industries We Serve
    </motion.h2>

    <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
      Delivering specialized solutions across multiple business domains.
    </p>

    <div className="grid md:grid-cols-4 gap-8">
  {[
    { name: "Healthcare", icon: Stethoscope },
    { name: "Finance & Banking", icon: Landmark },
    { name: "Retail & E-commerce", icon: ShoppingCart },
    { name: "Manufacturing", icon: Factory },
    { name: "IT & SaaS", icon: Laptop },
    { name: "Education", icon: GraduationCap },
    { name: "Automobile", icon: Car },
    { name: "Logistics", icon: Truck }
  ].map((item, index) => (
    <motion.div
      key={index}
      variants={scaleUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="p-6 bg-gray-50 rounded-xl shadow text-center hover:shadow-md transition"
    >
      <item.icon className="mx-auto mb-3 w-8 h-8 text-black" />
      <h3 className="font-bold text-lg">{item.name}</h3>
    </motion.div>
  ))}
</div>

  </div>
</section>

{/* CLIENTS */}
<section className="bg-gray-100 py-20">
  <div className="container mx-auto px-6">
    <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" className="text-4xl font-bold text-center">
      Our Clients
    </motion.h2>
    <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
      Trusted by startups, enterprises & global organizations.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
      {[
        "MECHYAM", "BOSETEK", 
      ].map((c, i) => (
        <motion.div key={i} variants={scaleUp} initial="hidden" whileInView="show"
          className="p-6 bg-white shadow rounded-xl text-center font-semibold">
          {c}
        </motion.div>
      ))}
    </div>
  </div>
</section>



{/* OUR PROCESS */}
<section className="bg-white py-20">
  <div className="container mx-auto px-6">
    <motion.h2 variants={fadeIn} initial="hidden" whileInView="show"
      className="text-4xl font-bold text-center">
      Our Approach
    </motion.h2>

    <div className="grid md:grid-cols-4 gap-10 mt-10">
      {[
        { title: "1. Discovery", icon: <Search size={32} className="mx-auto mb-4" /> },
        { title: "2. Planning", icon: <ClipboardList size={32} className="mx-auto mb-4" /> },
        { title: "3. Development", icon: <Code2 size={32} className="mx-auto mb-4" /> },
        { title: "4. Deployment", icon: <Rocket size={32} className="mx-auto mb-4" /> }
      ].map((step, i) => (
        <motion.div key={i} variants={scaleUp} initial="hidden" whileInView="show"
          className="p-8 bg-gray-50 rounded-2xl shadow text-center font-semibold">
          
          {step.icon}
          <p>{step.title}</p>

        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* BLOGS */}
<section className="bg-gray-100 py-20">
  <div className="container mx-auto px-6">
    <motion.h2 variants={fadeIn} initial="hidden" whileInView="show"
      className="text-4xl font-bold text-center">
      Latest Insights
    </motion.h2>

    <div className="grid md:grid-cols-3 gap-8 mt-10">
      {[
        {
          title: "Future of AI in Enterprises",
          desc: "How AI is reshaping automation & decision making."
        },
        {
          title: "Top 10 Cloud Trends 2025",
          desc: "A guide for CTOs preparing digital transformation."
        },
        {
          title: "Why UX Matters in 2025",
          desc: "Improve conversions with human-centered design."
        }
      ].map((b, i) => (
        <motion.div key={i} variants={scaleUp} initial="hidden" whileInView="show"
          className="p-8 bg-white shadow rounded-xl">
          <h3 className="font-bold text-blue-700 text-xl">{b.title}</h3>
          <p className="text-gray-700 mt-3">{b.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* WHY CHOOSE US */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="text-4xl font-bold text-center"
          >
            Why Choose Us
          </motion.h2>
          <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
            We deliver next-gen technology with precision, performance, and
            reliability.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Fast Delivery",
              "Secure Architecture",
              "Scalable Engineering",
              "24/7 Support",
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl shadow border hover:shadow-xl transition text-center"
              >
                <h3 className="font-bold text-xl">{item}</h3>
              </motion.div>
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
            { value: "1+", label: "Years Experience" },
            { value: "99.9%", label: "Uptime Guarantee" },
          ].map((m, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h3 className="text-5xl font-extrabold">{m.value}</h3>
              <p className="text-xl mt-2 opacity-90">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-6 py-20">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="text-4xl font-bold text-center"
        >
          What Our Clients Say
        </motion.h2>
        <p className="text-gray-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
          Trusted by organizations across industries.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Amit Sharma",
              feedback:
                "Outstanding team! Delivered our cloud migration ahead of schedule.",
            },
            {
              name: "Sara Williams",
              feedback: "Professional, reliable, and extremely skilled.",
            },
            {
              name: "Rajesh Kumar",
              feedback:
                "Our web platform performance improved dramatically.",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border"
            >
              <p className="text-gray-700 italic">“{t.feedback}”</p>
              <h3 className="font-bold text-blue-700 mt-4">{t.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 text-center">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="text-4xl font-bold"
        >
          Ready to Build Something Amazing?
        </motion.h2>
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="mt-3 text-xl opacity-90"
        >
          Let’s collaborate and bring your idea to life.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow hover:bg-gray-100 transition"
        >
          Get in Touch
        </motion.button>
      </section>

      <Footer />
    </div>
  );
}
