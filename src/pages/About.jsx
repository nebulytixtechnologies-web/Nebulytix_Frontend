
import React from "react";
import Navbar from "../components/Navbar";

export default function About() {
  
  return (
    <>
<Navbar />
    <div className="relative w-full overflow-hidden">

      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[120px] opacity-30"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* HEADER SECTION */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
            About  
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {" "}Us
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            We help organizations unlock the next era of digital transformation 
            through innovation, design, and intelligent technology.
          </p>
        </div>

        {/* WHO WE ARE */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Who We Are
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We are a digital-first innovation company specializing in designing and 
              developing scalable solutions for enterprises. Our mission is to empower 
              businesses with cutting-edge technologies and world-class customer experiences.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              With a passionate team and a forward-thinking approach, we bring clarity, 
              creativity, and precision to every project we take on.
            </p>
          </div>

          {/* IMAGE BOX */}
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Team Discussion"
              className="w-full h-[350px] object-cover"
            />
          </div>
        </div>

        {/* OUR VALUES */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Our Core Values
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            These values define who we are and guide everything we do.
          </p>
        </div>

        {/* VALUE CARDS */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Innovation",
              text: "We constantly push boundaries to create powerful and modern digital solutions.",
            },
            {
              title: "Excellence",
              text: "We deliver outstanding results with precision, quality, and reliability.",
            },
            {
              title: "Integrity",
              text: "We work with transparency, honesty, and commitment to client success.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="p-10 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-900">
                {value.title}
              </h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {value.text}
              </p>
            </div>
          ))}
        </div>

        {/* MISSION */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* IMAGE */}
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692"
              alt="Mission"
              className="w-full h-[350px] object-cover"
            />
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To help businesses accelerate growth through innovative technology 
              solutions, world-class user experience, and digital transformation strategies.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We aim to empower every client with the tools and systems needed 
              to succeed in a rapidly evolving digital world.
            </p>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
