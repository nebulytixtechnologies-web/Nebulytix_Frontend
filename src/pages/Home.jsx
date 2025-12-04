// src/pages/Home.jsx
// Deloitte US–style corporate homepage for Nebulytix (Premium Version)

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  ArrowRight,
  Cloud,
  Cpu,
  CircuitBoard,
  LineChart,
  Stethoscope,
  Landmark,
  ShoppingCart,
  Factory,
  Laptop,
  GraduationCap,
  Car,
  Truck,
  ShieldCheck,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=1600";
const INSIGHT_IMAGE =
  "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1600";
const WORKFORCE_IMAGE =
  "https://images.pexels.com/photos/1181572/pexels-photo-1181572.jpeg?auto=compress&cs=tinysrgb&w=1600";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Home() {
  const navigate = useNavigate();

  const scrollToServices = () => {
    const section = document.getElementById("services-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const industries = [
    { name: "Healthcare", icon: Stethoscope },
    { name: "Finance & Banking", icon: Landmark },
    { name: "Retail & E-commerce", icon: ShoppingCart },
    { name: "Manufacturing", icon: Factory },
    { name: "IT & SaaS", icon: Laptop },
    { name: "Education", icon: GraduationCap },
    { name: "Automobile", icon: Car },
    { name: "Logistics", icon: Truck },
  ];

  const insights = [
    {
      tag: "Workforce platforms",
      title: "From manual attendance to intelligent workforce automation",
      desc: "How Nebulytix helps organizations move from fragmented spreadsheets and devices to reliable, auditable platforms.",
      image: WORKFORCE_IMAGE,
    },
    {
      tag: "Cloud strategy",
      title: "Modernizing core systems without disrupting the business",
      desc: "A phased, architecture-first approach to cloud migrations for mid-size and growing enterprises.",
      image: INSIGHT_IMAGE,
    },
    {
      tag: "Delivery excellence",
      title: "Why engineering discipline matters more than tooling",
      desc: "Operating models, practices and governance that keep platforms stable as they scale.",
      image: null,
    },
  ];

  const metrics = [
    { value: "40+", label: "Projects delivered" },
    { value: "25+", label: "Clients served" },
    { value: "1+", label: "Years in operation" },
    { value: "99.9%", label: "Platform uptime" },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <Navbar />

      {/* ======================================================
                        HERO SECTION
      ====================================================== */}
      <section className="relative w-full h-[620px] overflow-hidden">
        {/* Background image */}
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          src={HERO_IMAGE}
          alt="Corporate team"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/10" />

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.22em] text-slate-200 uppercase"
            >
              NEBULYTIX TECHNOLOGY
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-4 text-white font-semibold leading-tight text-[2.7rem] md:text-[3.3rem] lg:text-[3.7rem]"
            >
              Cloud-Ready Workforce
              <br />
              & Enterprise Platforms
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-slate-200 text-[15px] md:text-[17px] leading-relaxed"
            >
              Helping organizations modernize their workforce, attendance and
              business systems with secure cloud engineering and scalable
              delivery.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-wrap gap-4"
            >
              {/* TALK TO US — NAVIGATE TO CONTACTS PAGE */}
              <button
                onClick={() => navigate("/contacts")}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-black text-sm font-medium rounded-md shadow-sm hover:bg-slate-100 hover:shadow-md transition-all"
              >
                Talk to Us
                <ArrowRight size={16} className="mt-[1px]" />
              </button>

              {/* EXPLORE SERVICES — SMOOTH SCROLL */}
              <button
                onClick={scrollToServices}
                className="inline-flex items-center gap-2 px-7 py-3 text-white border border-white/40 text-sm font-medium rounded-md hover:bg-white/10 transition-all"
              >
                Explore Services
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Thin divider */}
      <div className="border-t border-slate-200/70" />

      {/* ======================================================
                      AT A GLANCE SECTION
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.6fr,1.1fr] gap-12 lg:gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase mb-3">
              At a glance
            </p>

            <h2 className="text-[2.1rem] md:text-[2.4rem] font-semibold text-slate-900 leading-snug mb-4">
              A focused engineering partner for cloud, workforce and enterprise
              platforms.
            </h2>

            <p className="text-sm md:text-[0.98rem] text-slate-600 leading-relaxed max-w-2xl">
              Nebulytix combines hands-on implementation with an
              architecture-first mindset, helping clients move from fragile,
              manually stitched environments to reliable platforms that can grow
              with the business.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-x-10 gap-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p className="text-2xl md:text-3xl font-semibold text-slate-900">
                  {m.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-slate-600">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Soft divider */}
      <div className="border-t border-slate-200/70" />

      {/* ======================================================
                      SERVICES SECTION (Premium)
      ====================================================== */}
      <section
        id="services-section"
        className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <p className="text-[11px] tracking-[0.22em] text-slate-500 uppercase mb-2">
            Capabilities
          </p>

          <h2 className="text-[1.9rem] md:text-[2.2rem] font-semibold text-slate-900">
            What we do
          </h2>

          <p className="mt-2 max-w-2xl text-sm md:text-[0.95rem] text-slate-600">
            High-impact capabilities across cloud, applications, data,
            automation and security—engineered for scale, resilience and
            day-to-day reliability.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid md:grid-cols-3 gap-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
        >
          {[
            {
              title: "Cloud & Platform Engineering",
              desc: "Secure, scalable architectures on AWS and modern cloud ecosystems.",
              icon: Cloud,
            },
            {
              title: "Enterprise Application Delivery",
              desc: "Robust engineering for core workflows, APIs and enterprise-grade systems.",
              icon: CircuitBoard,
            },
            {
              title: "Data, AI & Automation",
              desc: "Analytics, AI and automation that directly improve operations.",
              icon: LineChart,
            },
            {
              title: "Cybersecurity & Compliance",
              desc: "Identity, access and cloud security frameworks aligned to governance needs.",
              icon: ShieldCheck,
            },
            {
              title: "DevOps & Modern Engineering",
              desc: "CI/CD, IaC and practices that improve reliability and speed to market.",
              icon: Cpu,
            },
            {
              title: "Technology Advisory",
              desc: "Architecture reviews, modernization roadmaps and investment-ready guidance.",
              icon: Landmark,
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group border border-slate-200 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors">
                    <Icon className="w-5 h-5 text-slate-800" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-slate-900">
                    {s.title}
                  </h3>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ======================================================
                         INSIGHTS SECTION
      ====================================================== */}
      <section className="bg-slate-50/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <motion.div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div>
              <p className="text-[11px] tracking-[0.22em] text-slate-500 uppercase mb-2">
                Insights
              </p>
              <h2 className="text-[2.1rem] md:text-[2.4rem] font-semibold text-slate-900">
                Latest perspectives
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-[0.98rem] text-slate-600">
                Short, practical viewpoints on where cloud, workforce and
                platform investments create measurable value.
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1.5fr,1.1fr] gap-10 lg:gap-14 items-stretch">
            {/* Main Insight */}
            <motion.article
              className="border border-slate-200 bg-white shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="md:w-1/2">
                <img
                  src={insights[0].image}
                  alt={insights[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-7 md:p-8 flex flex-col">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  {insights[0].tag}
                </p>
                <h3 className="mt-3 text-lg md:text-xl font-semibold text-slate-900">
                  {insights[0].title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                  {insights[0].desc}
                </p>
                <button className="mt-4 inline-flex items-center gap-1 text-xs md:text-sm font-medium text-slate-900 hover:underline">
                  Read more
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.article>

            {/* Secondary insights */}
            <motion.div
              className="grid gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
            >
              {insights.slice(1).map((ins, i) => {
                const hasImage = Boolean(ins.image);
                return (
                  <motion.article
                    key={i}
                    variants={fadeUp}
                    className="border border-slate-200 bg-white shadow-sm rounded-lg p-7 md:p-8 flex flex-col md:flex-row gap-4"
                  >
                    {hasImage && (
                      <div className="md:w-1/3">
                        <img
                          src={ins.image}
                          alt={ins.title}
                          className="w-full h-full object-cover rounded-md md:rounded-md"
                        />
                      </div>
                    )}
                    <div className={hasImage ? "md:w-2/3" : "w-full"}>
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                        {ins.tag}
                      </p>
                      <h3 className="mt-2 text-base md:text-lg font-semibold text-slate-900">
                        {ins.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {ins.desc}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
                       INDUSTRIES SECTION
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <p className="text-[11px] tracking-[0.22em] text-slate-500 uppercase mb-2">
            Sectors
          </p>

          <h2 className="text-[2.1rem] md:text-[2.4rem] font-semibold text-slate-900">
            Industries we serve
          </h2>

          <p className="mt-3 max-w-2xl text-sm md:text-[0.98rem] text-slate-600">
            We work across sectors where reliability, compliance and workforce
            scale are critical to day-to-day operations.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
        >
          {industries.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-7 bg-white/95 border border-slate-200 rounded-lg shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 mb-3">
                  <Icon className="w-6 h-6 text-slate-800" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">
                  {item.name}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ======================================================
                          CTA SECTION
      ====================================================== */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            className="border border-slate-200 bg-white/95 p-8 md:p-10 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div>
              <h2 className="text-[1.7rem] md:text-[2rem] font-semibold text-slate-900">
                Ready to discuss your next platform?
              </h2>

              <p className="mt-3 text-[0.98rem] text-slate-600 max-w-xl">
                Share a brief view of your landscape and priorities. We’ll
                respond with a structured, engineering-first way forward—not a
                generic sales pitch.
              </p>
            </div>

            <button
              onClick={() => navigate("/contacts")}
              className="px-6 py-3 bg-slate-900 text-white text-sm rounded-md font-medium shadow-sm hover:bg-black hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              Contact Nebulytix
              <ArrowRight size={16} className="mt-[1px]" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
