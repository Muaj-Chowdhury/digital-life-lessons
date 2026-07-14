import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHome, AiOutlineBars, AiOutlineClose } from "react-icons/ai";
import { BsGraphUp, BsMoon, BsSun } from "react-icons/bs";
import {
  FaChartLine,
  FaPenToSquare,
  FaRegBookmark,
  FaUserShield,
  FaUser,
} from "react-icons/fa6";
import { LuBookOpenCheck, LuBookOpenText } from "react-icons/lu";
import { GrLogout } from "react-icons/gr";
import { HiUserGroup } from "react-icons/hi2";
import { Flag, ChevronLeft, Sparkles } from "lucide-react";
import SidebarItem from "./SidebarItem";
import useRole from "../../../hooks/useRole";
import useAuth from "../../../hooks/useAuth";
import DigitalLifeLessonsLogo from "../../Logo/DigitalLifeLessonsLogo";

const Sidebar = () => {
  const { logOut } = useAuth();
  const { role } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "lifelessonsLight",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isAdmin = role === "admin";
  const toggleTheme = () =>
    setTheme((p) =>
      p === "lifelessonsDark" ? "lifelessonsLight" : "lifelessonsDark",
    );

  // This internal component contains ALL your links
  const FullMenuLinks = ({ isMobile }) => (
    <ul className="p-4 space-y-2">
      {/* General Section */}
      <p
        className={`text-[10px] font-black uppercase tracking-widest text-base-content/30 my-4 px-2 ${collapsed && !isMobile ? "text-center" : ""}`}
      >
        Menu
      </p>
      <SidebarItem
        to="/"
        icon={<AiOutlineHome />}
        label="Homepage"
        collapsed={collapsed && !isMobile}
        onClick={() => isMobile && setMobileOpen(false)}
      />
      <SidebarItem
        to="/dashboard"
        icon={<BsGraphUp />}
        label="User Statistics"
        collapsed={collapsed && !isMobile}
        end={true}
        onClick={() => isMobile && setMobileOpen(false)}
      />
      {isAdmin && (
        <SidebarItem
          to="/dashboard/admin"
          icon={<FaChartLine />}
          label="Admin Statistics"
          collapsed={collapsed && !isMobile}
          end={true}
          onClick={() => isMobile && setMobileOpen(false)}
        />
      )}
      <SidebarItem
        to="/dashboard/add-lesson"
        icon={<FaPenToSquare />}
        label="Add Lesson"
        collapsed={collapsed && !isMobile}
        onClick={() => isMobile && setMobileOpen(false)}
      />
      <SidebarItem
        to="/dashboard/my-lessons"
        icon={<LuBookOpenText />}
        label="My Lessons"
        collapsed={collapsed && !isMobile}
        onClick={() => isMobile && setMobileOpen(false)}
      />
      <SidebarItem
        to="/dashboard/my-favorites"
        icon={<FaRegBookmark />}
        label="My Favorites"
        collapsed={collapsed && !isMobile}
        onClick={() => isMobile && setMobileOpen(false)}
      />

      {/* Admin Section */}
      {isAdmin && (
        <>
          <p
            className={`text-[10px] font-black uppercase tracking-widest text-error/50 my-4 px-2 ${collapsed && !isMobile ? "text-center" : ""}`}
          >
            Management
          </p>
          <SidebarItem
            to="/dashboard/admin/manage-users"
            icon={<HiUserGroup />}
            label="Manage Users"
            collapsed={collapsed && !isMobile}
            onClick={() => isMobile && setMobileOpen(false)}
          />
          <SidebarItem
            to="/dashboard/admin/manage-lessons"
            icon={<LuBookOpenCheck />}
            label="Lessons Audit"
            collapsed={collapsed && !isMobile}
            onClick={() => isMobile && setMobileOpen(false)}
          />
          <SidebarItem
            to="/dashboard/admin/reported-lessons"
            icon={<Flag size={18} />}
            label="Reports"
            collapsed={collapsed && !isMobile}
            onClick={() => isMobile && setMobileOpen(false)}
          />
        </>
      )}

      {/* Settings & Account Section (Used to be Bottom Actions) */}
      <p
        className={`text-[10px] font-black uppercase tracking-widest text-base-content/30 my-4 px-2 ${collapsed && !isMobile ? "text-center" : ""}`}
      >
        Settings
      </p>

      {/* Theme Toggle as a pseudo-SidebarItem */}
      <li className="list-none">
        <div
          className={`${collapsed && !isMobile ? "tooltip tooltip-right" : ""} w-full`}
          data-tip="Toggle Theme"
        >
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-base-content/60 hover:bg-base-200"
          >
            <span className="text-xl flex-shrink-0">
              {theme === "lifelessonsDark" ? <BsSun /> : <BsMoon />}
            </span>
            {(!collapsed || isMobile) && (
              <span className="font-bold text-sm">Theme</span>
            )}
          </button>
        </div>
      </li>

      {role === "admin" && <SidebarItem
        to={"/dashboard/admin/profile"}
        icon={<FaUserShield />}
        label="Admin Profile Settings"
        collapsed={collapsed && !isMobile}
        onClick={() => isMobile && setMobileOpen(false)}
      />}
      <SidebarItem
        to={"/dashboard/profile"}
        icon={<FaUser />}
        label="User Profile Settings"
        collapsed={collapsed && !isMobile}
        onClick={() => isMobile && setMobileOpen(false)}
      />

      <li className="list-none">
        <div
          className={`${collapsed && !isMobile ? "tooltip tooltip-right" : ""} w-full`}
          data-tip="Logout"
        >
          <button
            onClick={logOut}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-error hover:bg-error/10"
          >
            <span className="text-xl flex-shrink-0">
              <GrLogout />
            </span>
            {(!collapsed || isMobile) && (
              <span className="font-black text-sm uppercase">Logout</span>
            )}
          </button>
        </div>
      </li>
    </ul>
  );

  return (
    <>
      {/* MOBILE UI */}
      <div className="md:hidden flex items-center justify-between p-4 bg-base-100 border-b sticky top-0 z-40">
        <div className="flex">
          <DigitalLifeLessonsLogo className="w-10 h-10 group-hover:rotate-6 transition duration-300" />
          <div className="flex flex-col leading-tight">
            <span className="font-black text-xl tracking-tight text-primary">
              Digital Life
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-60 font-bold">
              Lessons
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-base-200 rounded-lg"
        >
          <AiOutlineBars size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-72 bg-base-100 z-[90] overflow-y-auto"
            >
              <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <DigitalLifeLessonsLogo className="w-10 h-10 group-hover:rotate-6 transition duration-300" />
                  <span className="font-black text-2xl  tracking-tighter">
                    Dashboard
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <AiOutlineClose size={24} />
                </button>
              </div>
              <FullMenuLinks isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP UI */}
      <aside
        className={`hidden md:flex flex-col sticky top-0 h-screen bg-base-100  border-r border-base-300 transition-all duration-500 z-[70] ${collapsed ? "w-20" : "w-72"}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b shrink-0">
          {!collapsed && (
            <span className="font-black text-2xl italic tracking-tighter">
              Dashboard
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-base-200 hover:text-primary"
          >
            {collapsed ? (
              <AiOutlineBars size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* This is the magic scroll container */}
        <div className="flex-1 overflow-y-auto overflow-x-clip no-scrollbar">
          <FullMenuLinks isMobile={false} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
