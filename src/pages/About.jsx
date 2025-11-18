

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-8">
          About Nebulytix
        </h1>

        {/* Section 1 */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <p className="text-gray-700 leading-relaxed text-lg">
            Nebulytix is a forward-thinking technology company dedicated to delivering
            intelligent, scalable, and high-impact digital solutions. Founded with a vision
            to bridge the gap between innovation and business efficiency, we specialize in
            developing platforms and products that empower organizations to excel in an
            increasingly digital world.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            We bring together a team of passionate engineers, analysts, and strategic
            thinkers committed to delivering measurable value through modern engineering
            practices, data-driven insights, and end-to-end technology services.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our mission is to accelerate business transformation through intelligent digital
            solutions, enabling organizations to modernize processes, strengthen technological
            capabilities, and build future-ready systems.
          </p>
        </section>

        {/* Vision */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            To become a trusted global partner in digital innovation by delivering exceptional
            engineering, data insights, and impactful software solutions tailored to modern
            business ecosystems.
          </p>
        </section>

        {/* What We Do */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">What We Do</h2>

          <ul className="list-disc pl-6 text-gray-700 text-lg space-y-2">
            <li>Software Development — Scalable and high-performance applications.</li>
            <li>Cloud & Infrastructure — Secure, optimized cloud architecture.</li>
            <li>Data Analytics — Actionable insights from complex data.</li>
            <li>AI & Automation — Smart systems that enhance productivity.</li>
            <li>Digital Product Engineering — Complete development lifecycle solutions.</li>
          </ul>
        </section>

        {/* Our Approach */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Approach</h2>

          <ul className="list-disc pl-6 text-gray-700 text-lg space-y-2">
            <li>Client-Centric Collaboration</li>
            <li>Quality & Precision</li>
            <li>Innovation-Driven Execution</li>
            <li>Transparency & Integrity</li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Why Choose Nebulytix?</h2>

          <ul className="list-disc pl-6 text-gray-700 text-lg space-y-2">
            <li>Experienced and skilled engineering team</li>
            <li>Strong focus on quality, usability, and performance</li>
            <li>Tailored solutions designed for business impact</li>
            <li>Reliable support and long-term partnership</li>
            <li>Commitment to continuous innovation</li>
          </ul>
        </section>

        {/* Commitment */}
        <section className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Nebulytix is committed to empowering businesses with technology solutions that
            transform operations, strengthen decision-making, and create new opportunities
            for sustainable growth.
          </p>
        </section>

      </div>
    </main>
    <Footer/>
    </>
  );
};

export default About;
