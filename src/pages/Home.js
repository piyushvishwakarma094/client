import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MapIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

/**
 * Home
 * - Robust against undefined data (no .length on undefined)
 * - Works even if backend is not available
 * - Uses optional chaining everywhere
 * - Proper loading and empty states
 */

const Home = () => {
  // ================== State ==================
  const [recentPosts, setRecentPosts] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    fromCity: "",
    toCity: "",
    date: "",
  });

  // ================== Helpers ==================
  const safeFormatDate = (value) => {
    try {
      if (!value) return "—";
      const d = new Date(value);
      if (isNaN(d.getTime())) return "—";
      return format(d, "MMM dd, yyyy");
    } catch {
      return "—";
    }
  };

  // ================== Data Fetch ==================
  useEffect(() => {
    let mounted = true;

    const fetchRecentPosts = async () => {
      try {
        // NOTE: If you don't have a backend yet, this request will fail.
        // We catch the error and keep recentPosts as [] (safe).
        const res = await axios.get("/api/posts?limit=6");
        const posts = res?.data?.posts;

        if (!mounted) return;

        // Ensure it's always an array
        setRecentPosts(Array.isArray(posts) ? posts : []);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        if (!mounted) return;
        setRecentPosts([]); // never undefined
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecentPosts();

    return () => {
      mounted = false;
    };
  }, []);

  // ================== Search ==================
  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchFilters.fromCity) queryParams.append("fromCity", searchFilters.fromCity);
    if (searchFilters.toCity) queryParams.append("toCity", searchFilters.toCity);
    if (searchFilters.date) queryParams.append("date", searchFilters.date);

    window.location.href = `/posts?${queryParams.toString()}`;
  };

  // ================== Static UI Data ==================
  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: "Find Travel Partners",
      description:
        "Search trips by destination and date, and connect with like-minded travelers.",
    },
    {
      icon: UsersIcon,
      title: "Join Communities",
      description:
        "Meet fellow travelers, share experiences, and build lasting friendships.",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Real-time Chat",
      description:
        "Communicate instantly with potential travel partners through messaging.",
    },
  ];

  // ================== Render ==================
  return (
    <div className="space-y-12">
      {/* ================= Hero Section ================= */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Travel Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Connect with travelers from your city and explore the world together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/posts"
              className="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Find Trips
            </Link>
            <Link
              to="/register"
              className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Search Section ================= */}
      <section className="card max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Search for Trips</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From City
              </label>
              <input
                type="text"
                placeholder="Enter departure city"
                className="input-field"
                value={searchFilters.fromCity}
                onChange={(e) =>
                  setSearchFilters((prev) => ({ ...prev, fromCity: e.target.value }))
                }
              />
            </div>

            {/* To City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To City
              </label>
              <input
                type="text"
                placeholder="Enter destination city"
                className="input-field"
                value={searchFilters.toCity}
                onChange={(e) =>
                  setSearchFilters((prev) => ({ ...prev, toCity: e.target.value }))
                }
              />
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date
              </label>
              <input
                type="date"
                className="input-field"
                value={searchFilters.date}
                onChange={(e) =>
                  setSearchFilters((prev) => ({ ...prev, date: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn-primary px-8 py-3">
              <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
              Search Trips
            </button>
          </div>
        </form>
      </section>

      {/* ================= Features Section ================= */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TravelPartner?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(features || []).map((feature, index) => (
            <div key={index} className="card text-center">
              {/* icon component is safe */}
              <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Recent Posts Section ================= */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Trips</h2>
          <Link to="/posts" className="btn-secondary">
            View All Trips
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : Array.isArray(recentPosts) && recentPosts.length > 0 ? (
          // Render posts when we have them
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(recentPosts || []).map((post) => {
              // Safe fields with fallbacks
              const title = post?.title || "Untitled Trip";
              const fromCity = post?.fromCity || post?.from || "—";
              const toCity = post?.toCity || post?.to || "—";
              const travelDate =
                post?.travelDate || post?.date || post?.when || null;
              const time = post?.travelTime || post?.time || "—";
              const creatorName = post?.creator?.name || "Unknown";
              const status = (post?.status || "active").toLowerCase();

              const badgeColor =
                status === "active"
                  ? "badge-green"
                  : status === "full"
                  ? "badge-yellow"
                  : "badge-red";

              return (
                <Link
                  key={post?._id || title + fromCity + toCity}
                  to={`/posts/${post?._id || ""}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {title}
                    </h3>
                    <span className={`badge ${badgeColor}`}>{status}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {fromCity} → {toCity}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{safeFormatDate(travelDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{time}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {creatorName}</span>
                    <span>
                      {post?.currentParticipants ?? 0}/{post?.maxParticipants ?? 0} joined
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No trips available
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to create a trip and find travel partners!
            </p>
            <Link to="/create-post" className="btn-primary">
              Create First Trip
            </Link>
          </div>
        )}
      </section>

      {/* ================= CTA Section ================= */}
      <section className="bg-gray-100 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of travelers who have found their perfect travel partners
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary px-8 py-3 text-lg">
            Sign Up Now
          </Link>
          <Link to="/posts" className="btn-secondary px-8 py-3 text-lg">
            Browse Trips
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
