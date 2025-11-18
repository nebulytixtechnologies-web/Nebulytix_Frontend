
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Linkedin,
  Facebook,
  Twitter,
  Send,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-10 mt-20 relative">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-14">
        {/* Brand Section */}
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide mb-3">
            Nebulytix
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Innovating Workforce Automation & Intelligent Attendance Systems
            with world-class engineering.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Explore</h3>
          <ul className="space-y-3">
            {["Home", "Careers", "Services", "Support"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight
                  className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition"
                  size={16}
                />
                <span className="group-hover:text-white transition">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Contact</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-2">
              <Phone size={18} /> 8125263737
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> 8125263838
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} /> hr@nebulytixtechnologies.com
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">
            Stay Updated
          </h3>
          <p className="text-gray-400 mb-4">
            Subscribe for updates, releases & announcements.
          </p>

          <div className="flex bg-gray-800 p-2 rounded-xl items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent text-gray-300 outline-none px-2"
            />
            <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Office */}
      <div className="mt-14 mx-auto max-w-7xl px-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Corporate Office
        </h3>
        <div className="flex items-start gap-3 text-gray-400">
          <MapPin size={22} className="text-blue-400 flex-shrink-0" />
          <p>
            #501-B, PSR Prime Towers, 5th Floor, Beside DLF, Gachibowli,
            <br />
            Hyderabad, Telangana – 500 032
          </p>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-3 text-sm">Follow us on</p>

        <div className="flex justify-center gap-4">
          <a className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition">
            <Linkedin size={20} />
          </a>
          <a className="p-3 bg-gray-800 rounded-full hover:bg-blue-500 transition">
            <Facebook size={20} />
          </a>
          <a className="p-3 bg-gray-800 rounded-full hover:bg-cyan-400 transition">
            <Twitter size={20} />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Nebulytix. All rights reserved.
      </div>
    </footer>
  );
}