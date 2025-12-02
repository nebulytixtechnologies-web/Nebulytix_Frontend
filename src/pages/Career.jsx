//src/pages/Career.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobList from "../components/career/JobList";

export default function Career() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">
            Careers at Nebulytix Technology
          </h1>
          <p className="mt-2 text-gray-600">
            Browse open roles below — click{" "}
            <span className="font-semibold">View</span> to see details and
            apply.
          </p>

          <div className="mt-8">
            <JobList />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
