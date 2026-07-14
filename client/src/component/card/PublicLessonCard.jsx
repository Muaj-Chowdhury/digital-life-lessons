import { motion } from "framer-motion";
import { Link } from "react-router";
import { FiLock, FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const PublicLessonCard = ({ lesson, userIsPremium }) => {
  const {
    _id,
    title,
    description,
    category,
    tone,
    image,
    createdAt,
    accessLevel,
    authorName,
    authorImage,
  } = lesson;

  const isLocked = accessLevel === "premium" && userIsPremium !== true;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-base-100 rounded-3xl border border-base-200 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full"
    >
      {/* Image Section */}
      <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="backdrop-blur-md bg-black/30 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
            {category}
          </span>
        </div>

        {/* Access Level Badge */}
        {accessLevel === "premium" && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-1.5 rounded-xl shadow-lg">
              <HiSparkles className="text-white" size={18} />
            </div>
          </div>
        )}

        {/* Dark Overlay for better text legibility on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative">
        <div>
          {/* Tone & Meta */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary text-xs font-black uppercase tracking-tighter">
              {tone}
            </span>
            <span className="w-1 h-1 rounded-full bg-base-300" />
            <div className="flex items-center gap-1 text-base-content/40 text-xs">
              <FiCalendar />
              {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-base-content leading-tight mb-3 group-hover:text-primary transition-colors">
            {title}
          </h2>

          {/* Description with Lock Logic */}
          <div className="relative overflow-hidden">
            <p className={`text-base-content/60 text-sm leading-relaxed line-clamp-2 transition-all duration-500 ${
                isLocked ? "blur-[3px] select-none opacity-40" : ""
              }`}
            >
              {description}
            </p>

            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-base-200/80 backdrop-blur-sm rounded-2xl border border-base-300 shadow-sm">
                  <FiLock className="text-amber-600 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-base-content/70 tracking-widest">Premium Only</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-base-200 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={authorImage}
                alt={authorName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-base-200 group-hover:ring-primary/20 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-base-100 rounded-full" />
            </div>
            <div>
              <p className="text-xs font-black text-base-content/80 truncate max-w-[100px]">
                {authorName}
              </p>
              <p className="text-[10px] text-base-content/40 font-medium">Contributor</p>
            </div>
          </div>

          {/* Action Button */}
          {isLocked ? (
            <Link
              to="/upgrade"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              Unlock <FiArrowRight />
            </Link>
          ) : (
            <Link
              to={`/lesson-details/${_id}`}
              className="flex items-center gap-2 bg-base-content text-base-100 px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-primary transition-all active:scale-95 shadow-md"
            >
              View Lesson <FiArrowRight />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PublicLessonCard;