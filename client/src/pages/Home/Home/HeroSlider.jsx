import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
// IMPORT YOUR CONTAINER HERE
import Container from "../../../component/shared/Container"; 

import discoverLessons from "../../../assets/discover-lessons.jpg";
import realStories from "../../../assets/real-world-experience.jpg";
import saveLessons from "../../../assets/save-lessons.jpg";

import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";

const slides = [
  {
    title: "Learn From Real Experiences",
    text: "Real stories that shape better decisions",
    image: realStories,
  },
  {
    title: "Every Story Holds Wisdom",
    text: "Discover lessons shared by people worldwide",
    image: discoverLessons,
  },
  {
    title: "Grow One Lesson at a Time",
    text: "Save lessons that inspire your journey",
    image: saveLessons,
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      className="h-[70vh] lg:h-[85vh]"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="relative h-full w-full overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5 }}
              src={slide.image} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            {/* Darker Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
            
            <div className="absolute inset-0 flex items-center">
              <Container>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="max-w-2xl text-white space-y-6"
                >
                  <h2 className="text-5xl md:text-7xl font-black leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/80 font-medium">
                    {slide.text}
                  </p>
                  <Link to="/public-lessons"><button className="btn btn-primary btn-lg rounded-full px-8 shadow-xl hover:scale-105 transition">
                    Explore Lessons
                  </button></Link>
                </motion.div>
              </Container>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
