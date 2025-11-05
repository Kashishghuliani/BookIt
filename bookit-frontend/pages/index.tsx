// pages/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { Experience } from "../types";

function ExperienceCard({ exp }: { exp: Experience }) {
  // Default image: Hot Air Balloon Ride 🪂🎈
  const defaultImage =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80";

  return (
    <Link
      href={`/experience/${exp._id}`}
      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="h-52 bg-gray-100 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={exp.images?.[0] || defaultImage}
          alt={exp.title || "Hot Air Balloon Ride"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
          {exp.title || "Hot Air Balloon Ride"}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {exp.description ||
            "Enjoy a breathtaking hot air balloon ride with stunning panoramic views and a peaceful experience above the clouds."}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-gray-800">
            ₹{exp.price?.toFixed(0) || "2999"}
          </span>
          <span className="text-sm text-blue-500 font-medium group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/experiences")
      .then((res) => {
        if (!mounted) return;
        const exps = res.data.experiences || res.data;
        setExperiences(exps);
      })
      .catch(() => setError("Failed to load experiences"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading experiences...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 font-medium">{error}</div>
      </div>
    );

  if (!experiences || experiences.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">
          No experiences available. Try our Hot Air Balloon Ride!
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          BookIt — Experiences
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <ExperienceCard key={exp._id} exp={exp} />
          ))}
        </div>
      </div>
    </div>
  );
}
