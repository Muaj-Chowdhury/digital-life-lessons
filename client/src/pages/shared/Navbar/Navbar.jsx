import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineDashboard,
} from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import { BsSun, BsMoon } from "react-icons/bs";
import DigitalLifeLessonsLogo from "../../../component/Logo/DigitalLifeLessonsLogo";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";



const Navbar = () => {
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  


  /* THEME LOGIC */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "lifelessonsDark"
      : "lifelessonsLight";
  });


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "lifelessonsDark" ? "lifelessonsLight" : "lifelessonsDark",
    );
  };

  /* SCROLL LISTENER */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* PREMIUM STATUS */
  const { data: isPremium } = useQuery({
    queryKey: ["user-access", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data.isPremium;
    },
    enabled: !!user?.email,
  });

  const closeDrawer = () => setDrawerOpen(false);

  const navLinkStyles = ({ isActive }) =>
    `px-3 py-2 font-semibold transition flex items-center gap-2 ${
      isActive
        ? "text-primary bg-primary/5 lg:bg-transparent rounded-lg"
        : "text-base-content/70 hover:text-primary"
    }`;

  /* SHARED NAV LINKS */
  const NavItems = () => (
    <>
      <NavLink onClick={closeDrawer} to="/" className={navLinkStyles}>
        Home
      </NavLink>
      <NavLink
        onClick={closeDrawer}
        to="/public-lessons"
        className={navLinkStyles}
      >
        Public Lessons
      </NavLink>
      {user && (
        <>
          <NavLink
            onClick={closeDrawer}
            to="/dashboard/my-lessons"
            className={navLinkStyles}
          >
            My Lessons
          </NavLink>
          <NavLink
            onClick={closeDrawer}
            to="/dashboard/add-lesson"
            className={navLinkStyles}
          >
            Add Lesson
          </NavLink>
          {!isPremium && (
            <NavLink
              onClick={closeDrawer}
              to="/upgrade"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-content font-bold hover:opacity-90 transition shadow-sm"
            >
              <HiOutlineSparkles /> Upgrade
            </NavLink>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-base-100/80 backdrop-blur-md shadow-lg h-16"
            : "bg-base-100 h-20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <DigitalLifeLessonsLogo className="w-10 h-10 group-hover:rotate-6 transition duration-300" />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl tracking-tight text-primary">
                Digital Life
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-60 font-bold">
                Lessons
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-4">
            <NavItems />
            <div className="h-6 w-[1px] bg-base-300 mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-base-200 hover:bg-base-300 transition-colors"
            >
              <AnimatePresence mode="wait">
                {theme === "lifelessonsDark" ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                  >
                    <BsSun size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -45 }}
                  >
                    <BsMoon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-base-300 bg-base-100 hover:border-primary/40 transition-all"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/10"
                    src={user?.photoURL || "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg"}
                    alt="profile"
                  />
                  <AiOutlineMenu className="text-base-content/60" size={16} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl bg-base-100 shadow-2xl border border-base-300 overflow-hidden"
                    >
                      <div className="p-4 bg-base-200/50">
                        <p className="text-xs font-bold opacity-50 uppercase mb-1">
                          Account
                        </p>
                        <p className="font-bold truncate">
                          {user?.displayName}
                        </p>
                        {isPremium && (
                          <span className="mt-2 inline-flex items-center gap-1 bg-primary text-primary-content text-[10px] font-black px-2 py-0.5 rounded-full">
                            PREMIUM ⭐
                          </span>
                        )}
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 rounded-xl transition-colors"
                        >
                          <AiOutlineDashboard size={18} /> Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 rounded-xl transition-colors"
                        >
                          <AiOutlineUser size={18} /> My Profile
                        </Link>
                        <div className="h-[1px] bg-base-300 my-1" />
                        <button
                          onClick={() => {
                            logOut();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/10 rounded-xl font-bold transition-colors"
                        >
                          <AiOutlineLogout size={18} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm px-6 rounded-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden p-2 btn btn-ghost btn-circle"
            onClick={() => setDrawerOpen(true)}
          >
            <AiOutlineMenu size={24} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-base-100 z-[70] shadow-2xl flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="p-6 flex justify-between items-center border-b border-base-200">
                <DigitalLifeLessonsLogo className="w-9" />
                <button
                  onClick={closeDrawer}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* User Profile Section (Mobile) */}
                {user ? (
                  <div className="bg-base-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        className="h-12 w-12 rounded-full border-2 border-primary/20"
                        src={user?.photoURL}
                        alt="p"
                      />
                      <div>
                        <p className="font-bold leading-tight">
                          {user?.displayName}
                        </p>
                        <p className="text-xs opacity-60 truncate max-w-[150px]">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {isPremium && (
                      <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4">
                        PREMIUM MEMBER
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        onClick={closeDrawer}
                        to="/dashboard"
                        className="btn btn-sm btn-outline gap-1 text-[11px]"
                      >
                        <AiOutlineDashboard /> Dashboard
                      </Link>
                      <Link
                        onClick={closeDrawer}
                        to="/dashboard/profile"
                        className="btn btn-sm btn-outline gap-1 text-[11px]"
                      >
                        <AiOutlineUser /> Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="btn btn-primary w-full"
                  >
                    Login to Account
                  </Link>
                )}

                {/* Main Links */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-3">
                    Navigation
                  </p>
                  <NavItems />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-base-200 bg-base-200/50 space-y-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full font-bold text-base-content p-2"
                >
                  <span className="flex items-center gap-3">
                    {theme === "lifelessonsDark" ? (
                      <BsSun className="text-yellow-500" />
                    ) : (
                      <BsMoon className="text-blue-500" />
                    )}
                    {theme === "lifelessonsDark" ? "Light Mode" : "Dark Mode"}
                  </span>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${theme === "lifelessonsDark" ? "bg-primary" : "bg-gray-400"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === "lifelessonsDark" ? "right-1" : "left-1"}`}
                    />
                  </div>
                </button>

                {user && (
                  <button
                    onClick={() => {
                      logOut();
                      closeDrawer();
                    }}
                    className="flex items-center gap-3 w-full p-2 text-error font-bold"
                  >
                    <AiOutlineLogout size={20} /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
