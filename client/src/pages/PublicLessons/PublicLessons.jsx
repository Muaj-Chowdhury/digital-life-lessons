import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles, Filter } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PublicLessonCard from "../../component/card/PublicLessonCard";
import Container from "../../component/shared/Container";
import Loading from "../../component/shared/Loading";

const PublicLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  
  // State
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 4;

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Get user access level
  const { data: userIsPremium } = useQuery({
    enabled: !!user?.email,
    queryKey: ["user-access", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res?.data.isPremium;
    },
  });

  // Get public lessons
  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ["public-lessons", category, tone, sortBy, debouncedSearch, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/lessons?visibility=public&page=${page}&limit=${limit}&sortBy=${sortBy}&category=${category}&tone=${tone}&search=${debouncedSearch}`
      );
      return res.data;
    },
    keepPreviousData: true, // Prevents flickering during pagination
  });

  const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

  return (
    <div className="bg-base-100 min-h-screen pb-20 pt-10">
      <Container>
        {/* Header Section */}
        <header className="text-center mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase"
          >
            <Sparkles size={16} /> Explore Wisdom
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-base-content tracking-tight">
            Shared <span className="text-primary">Lessons</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base-content/60 font-medium">
            Browse through real-life realizations and experiences shared by our community.
          </p>
        </header>

        {/* Filter & Search Bar - Glassmorphism style */}
        <section className=" z-30 mb-10">
          <div className="p-4 bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-3xl shadow-xl shadow-base-300/20 flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
              <input
                type="text"
                placeholder="Search by topic or keywords..."
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:ring-2 ring-primary/50 transition-all font-medium"
              />
            </div>

            {/* Selects Container */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-sm font-bold text-base-content/40 mr-2">
                <Filter size={16} /> Filters:
              </div>
              
              <select
                className="select select-sm rounded-xl bg-base-200 border-none font-bold"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>

              <select
                className="select select-sm rounded-xl bg-base-200 border-none font-bold"
                value={tone}
                onChange={(e) => { setTone(e.target.value); setPage(1); }}
              >
                <option value="">All Tones</option>
                {emotionalTones.map((t) => <option key={t}>{t}</option>)}
              </select>

              <div className="h-8 w-[1px] bg-base-300 mx-2 hidden lg:block" />

              <select
                className="select select-sm rounded-xl bg-primary text-white border-none font-bold"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              >
                <option value="newest">Newest First</option>
                <option value="mostSaved">Popular</option>
              </select>
            </div>
          </div>
        </section>

        {/* Lessons Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Loading key="loading" />
          ) : lessonsData?.lessons?.length ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {lessonsData.lessons.map((lesson, index) => (
                <motion.div
                  key={lesson._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PublicLessonCard lesson={lesson} userIsPremium={userIsPremium} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300"
            >
              <div className="bg-base-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-base-content/30" />
              </div>
              <h3 className="text-xl font-bold">No results found</h3>
              <p className="opacity-50">Try adjusting your filters or search terms.</p>
              <button onClick={() => {setCategory(""); setTone(""); setSearchText("");}} className="btn btn-primary btn-sm mt-6 rounded-full">Reset All</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination - Modern style */}
        {!isLoading && lessonsData?.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-16">
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="btn btn-circle btn-ghost disabled:opacity-30"
              >
                <ChevronLeft />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: lessonsData.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      page === i + 1 
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                      : "bg-base-200 hover:bg-base-300 text-base-content/60"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={page === lessonsData.totalPages}
                onClick={() => setPage(p => Math.min(lessonsData.totalPages, p + 1))}
                className="btn btn-circle btn-ghost disabled:opacity-30"
              >
                <ChevronRight />
              </button>
            </div>
            <p className="text-xs font-bold opacity-30 uppercase tracking-widest">
              Page {page} of {lessonsData.totalPages}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PublicLessons;