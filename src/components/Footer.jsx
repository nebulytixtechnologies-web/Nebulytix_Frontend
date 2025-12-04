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
    <footer className="bg-white border-t border-slate-200 pt-16 pb-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-14">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-3">
            Nebulytix
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Engineering reliable, scalable digital solutions for organizations
            that value technology discipline.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-5">Explore</h3>
          <ul className="space-y-3 text-sm">
            {["Home", "Careers", "Services", "Support"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 transition"
              >
                <ChevronRight size={14} className="text-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-5">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Phone size={16} /> 8125263737
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> 8125263838
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> hr@nebulytixtechnologies.com
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-5">
            Stay Updated
          </h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Subscribe to receive updates and announcements.
          </p>

          <div className="flex bg-slate-100 border border-slate-300 rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent text-slate-700 px-3 py-2 text-sm outline-none"
            />
            <button className="px-3 bg-slate-900 hover:bg-slate-800 transition text-white flex items-center justify-center">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Office */}
      <div className="max-w-6xl mx-auto px-6 mt-14">
        <h3 className="text-lg font-medium text-slate-900 mb-3">
          Corporate Office
        </h3>
        <div className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
          <MapPin size={18} className="text-slate-700 flex-shrink-0" />
          <p>
            #501-B, PSR Prime Towers, 5th Floor, Beside DLF, Gachibowli,
            <br />
            Hyderabad, Telangana – 500 032
          </p>
        </div>
      </div>

      {/* Social */}
      <div className="text-center mt-12">
        <p className="text-slate-500 text-xs mb-3">Connect with us</p>

        <div className="flex justify-center gap-3">
          {[Linkedin, Facebook, Twitter].map((Icon, i) => (
            <a
              key={i}
              className="p-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
            >
              <Icon size={16} className="text-slate-700" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-200 mt-10 pt-6 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Nebulytix. All rights reserved.
      </div>
    </footer>
  );
}
