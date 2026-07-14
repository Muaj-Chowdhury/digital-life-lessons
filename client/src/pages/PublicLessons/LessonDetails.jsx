import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaTags, FaQuoteLeft } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import {
  Heart,
  Star,
  Flag,
  Share2,
  Clock,
  MessageSquare,
  Trash2,
  Send,
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Container from "../../component/shared/Container";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ReportModal from "../../component/Modals/ReportModal";
import PublicLessonCard from "../../component/card/PublicLessonCard";
import Loading from "../../component/shared/Loading";

const LessonDetails = () => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  // console.log(user);

  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCommentForm, setOpenCommentForm] = useState();
  // const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState("");
  // 1. Keep your existing states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const axiosSecure = useAxiosSecure();

  // console.log(id);

  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareTitle = "Check this out!";

  // get user access level

  const { data: isPremium } = useQuery({
    queryKey: ["user-access", user?.email],

    queryFn: async () => {
      if (!user?.email) return null;

      const res = await axiosSecure.get(`/users/${user?.email}`);

      return res.data.isPremium;
    },

    enabled: !!user?.email,
  });

  // API call for lesson

  const {
    data: lessonData,

    isLoading,

    isError,
  } = useQuery({
    queryKey: ["lessonData", id, user?.email],

    queryFn: async () => {
      const res = await axiosSecure(`/lesson/${id}?userEmail=${user?.email}`);

      console.log("actual server data", res.data);

      return res?.data;
    },

    enabled: !!id,
  });

  // AUTHOR SECTION (React Query)

  const { data: authorInfo } = useQuery({
    queryKey: ["author-summary", lessonData?.authorEmail],

    enabled: !!lessonData?.authorEmail,

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/author/${lessonData.authorEmail}/summary`,
      );

      return res.data;
    },
  });

  // FETCH SIMILAR LESSONS

  const { data: similarCategory } = useQuery({
    queryKey: ["similar-category", id],

    enabled: !!id,

    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/similar/category/${id}`);

      console.log(res.data);

      return res.data;
    },
  });

  const isFavorite = lessonData?.isFavorite;

  const favoritesCount = lessonData?.favoritesCount;

  // API call for comments

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],

    queryFn: async () => {
      const res = await axiosSecure(`/lesson/comments/${id}`);

      console.log(" comment data", res.data);

      return res.data;
    },
  });

  // handle Report

  const reportSubmit = async (reason) => {
    try {
      const response = await axiosSecure.post(`/lessons/${id}/report`, {
        reporterEmail: user?.email,

        reason: reason,
      });

      if (response.data.success === true) {
        toast.success("Content reported successfully!");
      }

      if (response.data.success === false) {
        toast(response.data.message);
      }
    } catch {
      toast.error("Failed to submit report.");
    }
  };

  // API call for posting favorite lessons

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosSecure.post(`/lesson/favorites/${id}`, {
        userEmail: user?.email,
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries(["lessonData", id, user?.email]);

      const previousLesson = await queryClient.getQueryData([
        "lessonData",
        id,
        user?.email,
      ]);

      console.log("previous lesson for favorite", previousLesson);

      // optimistic update

      const updatedLesson = await queryClient.setQueryData(
        ["lessonData", id, user?.email],

        (old) => ({
          ...old,
          isFavorite: !old.isFavorite,

          favoritesCount:
            old.isFavorite === true
              ? old.favoritesCount - 1
              : old.favoritesCount + 1,
        }),
      );

      console.log("optimistic updated for favorite", updatedLesson);

      return { previousLesson };
    },

    onError: (_, __, context) => {
      // rollback if failed

      queryClient.setQueryData(
        ["lessonData", id, user?.email],

        context.previousLesson,
      );
    },

    onSettled: () => {
      // sync with backend

      queryClient.invalidateQueries(["lessonData", id, user?.email]);
    },
  });

  const {
    _id,
    image,
    title,

    description,

    tone,

    category,

    createdAt,

    updatedAt,
  } = lessonData || {};

  // refetch data after onClick likeHandle function

  useEffect(() => {
    if (lessonData) {
      setIsLiked(lessonData.likes?.includes(user?.email));
      setLikesCount(lessonData.likes?.length || 0);
    }
  }, [lessonData, user]);

  // 1. Handle the loading state

  if (isLoading) return <Loading></Loading>;

  // 2. Handle potential errors (optional but good practice)

  if (isError || !lessonData) {
    return (
      <div className="text-center mt-20 text-red-500">Lesson not found!</div>
    );
  }

  // handle favorites

  const handleFavorite = async () => {
    if (!user?.email) return toast.error("please login to saved");

    favoriteMutation.mutate();

    //  try{

    //   const {data} = await axiosSecure.post(`/lesson/favorites/${id}` ,{

    //       userEmail: user?.email

    //     })

    //     console.log("server response", data.favorited)

    //     // setIsFavorite(data.favorited)

    //     // 🔥 force fresh data

    //   queryClient.invalidateQueries(["lessonData", id, user?.email]);

    //  }

    //  catch{

    //   toast.error("Something went wrong!");

    //  }
  };

  // handle comments

  const handleComment = async (e) => {
    e.preventDefault();

    if (!user?.email) return toast.error("please login to comment");

    const commentData = {
      userName: user.displayName,

      userEmail: user.photoURL,

      userPhoto: user?.photoURL,

      commentText: comment,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    try {
      const { data } = await axiosSecure.post(
        `/lesson/comments/${id}`,

        commentData,
      );

      if (data.insertedId) {
        toast.success("comment submitted");

        queryClient.invalidateQueries(["comments", id]);

        console.log("Comment Submitted:", data);
      }
    } catch {
      toast.error("something went wrong");
    }
  };

  // handle likes

  const handleLike = async () => {
    if (!user?.email) return toast("Please login to like!");

    const prevLiked = isLiked;

    const prevLikesCount = likesCount;

    setIsLiked((prev) => !prev);

    setLikesCount((prev) => prev + (prevLiked ? -1 : 1));

    console.log("optimistic update for  like", isLiked, likesCount);

    try {
      const { data } = await axiosSecure.put(`/lesson/likes/${_id}`, {
        userEmail: user?.email,
      });

      if (data.success) {
        // Sync with the actual count from the server response

        setIsLiked(data.isLiked);

        setLikesCount(data.likesCount);

        console.log("server response", isLiked, likesCount);
      } else {
        throw new Error();
      }
    } catch {
      setIsLiked(prevLiked);

      setLikesCount(prevLikesCount);

      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-base-100 min-h-screen pb-20">
      {/* Header Spacer */}
      <div className="h-16 md:h-20" />

      <Container>
        {/* Breadcrumb & Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/public-lessons"
            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft size={20} /> Back to Lessons
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: CONTENT AREA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* Main Content Card */}
            <div className="bg-base-100 border border-base-300 rounded-3xl overflow-hidden shadow-xl shadow-base-300/20">
              <div className="relative group overflow-hidden">
                <img
                  src={image}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={title}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge badge-primary font-bold py-3 px-4 uppercase text-[10px] tracking-widest">
                    {category}
                  </span>
                  <span className="badge badge-secondary font-bold py-3 px-4 uppercase text-[10px] tracking-widest">
                    {tone}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-wrap items-center gap-6 text-sm text-base-content/60 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />5 min read
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-base-content leading-tight tracking-tight">
                  {title}
                </h1>

                <div className="relative">
                  <FaQuoteLeft className="absolute -left-4 -top-4 text-primary/10 text-6xl" />
                  <p className="text-lg md:text-xl text-base-content/80 leading-relaxed font-medium relative z-10">
                    {description}
                  </p>
                </div>

                {/* Interaction Bar */}
                <div className="pt-8 border-t border-base-300 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold border ${isLiked ? "bg-error/10 border-error text-error shadow-lg shadow-error/20" : "bg-base-200 border-transparent text-base-content/70 hover:bg-base-300"}`}
                    >
                      <Heart
                        size={20}
                        fill={isLiked ? "currentColor" : "none"}
                      />
                      {likesCount} Likes
                    </button>

                    <button
                      onClick={handleFavorite}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold border ${isFavorite ? "bg-warning/10 border-warning text-warning shadow-lg shadow-warning/20" : "bg-base-200 border-transparent text-base-content/70 hover:bg-base-300"}`}
                    >
                      <Star
                        size={20}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                      {isFavorite ? "Saved" : "Save Lesson"}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-3 rounded-full bg-base-200 hover:bg-primary hover:text-white transition-all text-base-content/70"
                      >
                        <Share2 size={20} />
                      </button>
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute bottom-full right-0 mb-4 p-2 bg-base-100 border border-base-300 rounded-2xl shadow-2xl flex gap-2 z-50"
                          >
                            <FacebookShareButton url={shareUrl}>
                              <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton url={shareUrl}>
                              <XIcon size={32} round />
                            </TwitterShareButton>
                            <LinkedinShareButton url={shareUrl}>
                              <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                            <WhatsappShareButton url={shareUrl}>
                              <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-3 rounded-full bg-base-200 hover:bg-error hover:text-white transition-all text-base-content/70"
                    >
                      <Flag size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="bg-base-200/50 rounded-3xl p-6 md:p-10 border border-base-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black flex items-center gap-3 text-base-content">
                  <MessageSquare size={24} className="text-primary" />
                  Insights{" "}
                  <span className="text-sm opacity-50 bg-base-300 px-3 py-1 rounded-full">
                    {comments.length}
                  </span>
                </h3>
                <button
                  onClick={() => setOpenCommentForm(!openCommentForm)}
                  className="btn btn-primary btn-sm rounded-full normal-case font-bold"
                >
                  {openCommentForm ? "Cancel" : "Add Comment"}
                </button>
              </div>

              <AnimatePresence>
                {openCommentForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-10"
                  >
                    <form
                      onSubmit={handleComment}
                      className="space-y-4 bg-base-100 p-6 rounded-2xl border border-primary/20"
                    >
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="textarea textarea-bordered w-full bg-base-200 border-none focus:ring-2 ring-primary/50 text-base-content h-32 text-lg font-medium"
                        placeholder="What did you learn from this story?"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-full px-8 gap-2 group"
                        >
                          Post Insight{" "}
                          <Send
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                {comments.map((c) => (
                  <motion.div
                    layout
                    key={c._id}
                    className="flex gap-4 p-5 bg-base-100 rounded-2xl border border-base-300/50"
                  >
                    <img
                      src={c.userPhoto}
                      className="w-12 h-12 rounded-full ring-2 ring-primary/10"
                      alt=""
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-base-content">
                          {c.userName}
                        </h4>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-base-content/70 font-medium leading-relaxed">
                        {c.commentText}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Author Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-accent p-0.5 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="bg-base-100 p-8 rounded-[22px] space-y-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={authorInfo?.authorImage}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary/20"
                      alt=""
                    />
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-success border-4 border-base-100 rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-base-content">
                      {authorInfo?.authorName}
                    </h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
                      Thought Leader
                    </p>
                  </div>
                </div>

                <p className="text-center text-sm text-base-content/70 font-medium leading-relaxed italic">
                  "
                  {authorInfo?.bio ||
                    "Sharing experiences to help the community grow and learn together."}
                  "
                </p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-base-300">
                  <div className="text-center">
                    <p className="text-2xl font-black text-base-content">
                      {authorInfo?.totalLessons}
                    </p>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                      Lessons
                    </p>
                  </div>
                  <div className="text-center border-l border-base-300">
                    <p className="text-2xl font-black text-base-content">4.9</p>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                      Rating
                    </p>
                  </div>
                </div>

                <Link to={`/profile/${lessonData?.authorEmail}`}>
                  <button className="btn btn-primary w-full rounded-2xl normal-case font-bold group">
                    View Full Profile{" "}
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Similar Content */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-black flex items-center gap-2 text-base-content">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Related Wisdom
              </h3>
              <div className="space-y-4">
                {similarCategory?.slice(0, 3).map((lesson) => (
                  <Link
                    key={lesson._id}
                    to={`/lesson-details/${lesson._id}`}
                    className="block group"
                  >
                    <div className="flex gap-4 items-center bg-base-100 p-3 rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                      <img
                        src={lesson.image}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                        alt=""
                      />
                      <div>
                        <h4 className="font-bold text-base-content leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {lesson.title}
                        </h4>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-2">
                          By {lesson.authorName}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>

      <ReportModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        reportSubmit={reportSubmit}
      />
    </div>
  );
};

export default LessonDetails;
