import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  // ✅ States
  const [recentPosts, setRecentPosts] = useState([]); // array safe
  const [loading, setLoading] = useState(true);

  // Example static arrays (features, testimonials)
  const features = [
    {
      title: "Find Travel Buddies",
      description: "Connect with people traveling to the same destination.",
    },
    {
      title: "Safe & Secure",
      description: "Verified profiles and safe messaging options.",
    },
    {
      title: "Plan Together",
      description: "Share itineraries and split travel costs easily.",
    },
  ];

  const testimonials = [
    {
      name: "Amit",
      text: "I found an amazing travel buddy for my Goa trip! This app is a game changer.",
    },
    {
      name: "Riya",
      text: "Super easy to use, I saved money and had fun traveling with a new friend.",
    },
    {
      name: "John",
      text: "Love the simplicity and security features. Highly recommended!",
    },
  ];

  // ✅ Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts?limit=6");
        setRecentPosts(response.data?.posts || []); // ✅ safe fallback
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setRecentPosts([]); // ✅ prevent crash
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= Hero Section ================= */}
      <section className="bg-blue-50 text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Travel Partner
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Connect with travelers who share your destination and make your journey memorable.
        </p>
        <Link
          to="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create a Trip Post
        </Link>
      </section>

      {/* ================= Features Section ================= */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {(features || []).map((feature, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Recent Posts Section ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8">Recent Trips</h2>

          {loading ? (
            <p className="text-gray-500">Loading trips...</p>
          ) : (recentPosts || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(recentPosts || []).map((post) => (
                <div
                  key={post._id}
                  className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
                >
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-2">
                    {post.description || "No description provided"}
                  </p>
                  <p className="text-sm text-gray-500">
                    From <strong>{post.from || "N/A"}</strong> to{" "}
                    <strong>{post.to || "N/A"}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {post.date || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {post.creator?.name || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">No posts available</p>
          )}
        </div>
      </section>

      {/* ================= Testimonials Section ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(testimonials || []).map((t, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-gray-50"
              >
                <p className="text-gray-700 italic mb-4">"{t.text}"</p>
                <h4 className="text-lg font-bold">- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA Section ================= */}
      <section className="py-20 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
        <p className="text-lg mb-6">
          Join our community and find your travel partner today!
        </p>
        <Link
          to="/signup"
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

      {/* ================= Footer Section ================= */}
      <footer className="py-10 bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} TravelMate. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
