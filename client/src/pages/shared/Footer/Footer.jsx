import {
  Facebook,
  Linkedin,
  Mail,
  Globe,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import DigitalLifeLessonsLogo from "../../../component/Logo/DigitalLifeLessonsLogo";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: isPremium } = useQuery({
    queryKey: ["user-access", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data.isPremium;
    },
    enabled: !!user?.email,
  });

  // Define your links array
  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Public Lessons', path: '/public-lessons' },
    ...(!user ? []: [{ name: 'Dashboard', path: '/dashboard' }]),
    // Only add Upgrade if the user is NOT premium
    ...(user && !isPremium ? [{ name: 'Upgrade', path: '/upgrade' }] : [])
  ];
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6 },
    },
  };



  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-base-300 text-base-content mt-20 border-t border-base-content/5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* Brand Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Link to="/" className="flex items-center gap-3 group">
            <DigitalLifeLessonsLogo className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-black tracking-tighter text-gradient">
              Life Lessons
            </span>
          </Link>

          <p className="text-sm text-base-content/70 leading-relaxed font-medium">
            Preserve your wisdom, reflect on experiences, and grow through
            meaningful lessons shared by people worldwide.
          </p>

          <div className="flex gap-4">
            {[Facebook, Linkedin, Globe].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 rounded-xl bg-base-100 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        {/* Navigation */}
        <motion.div variants={itemVariants}>
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-base-content">
            <span className="w-2 h-2 rounded-full bg-primary" /> Explore
          </h3>
          <ul className="space-y-4 text-sm font-semibold">
          {footerLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="group flex items-center gap-2 text-base-content/60 hover:text-primary transition-all">
                <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        </motion.div>

        {/* Legal */}
        <motion.div variants={itemVariants}>
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" /> Legal
          </h3>
          <ul className="space-y-4 text-sm font-semibold">
            {["Terms & Conditions", "Privacy Policy", "Cookie Policy"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-base-content/60 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" /> Contact
          </h3>

          <div className="space-y-4">
            <a
              href="mailto:support@digitallifelessons.com"
              className="flex items-center gap-3 p-3 rounded-2xl bg-base-100/50 hover:bg-base-100 transition-colors border border-base-content/5 group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={16} />
              </div>
              <span className="text-xs font-bold truncate">
                support@digitallifelessons.com
              </span>
            </a>

            <div className="flex items-start gap-3 p-3">
              <MapPin size={18} className="text-secondary shrink-0" />
              <p className="text-xs font-bold opacity-60">
                Dhaka, Bangladesh <br />
                <span className="font-medium">
                  Helping people grow through shared experiences.
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="bg-base-100/30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold opacity-50">
          <p>
            © {new Date().getFullYear()} Digital Life Lessons. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer">Status</span>
            <span className="hover:text-primary cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
