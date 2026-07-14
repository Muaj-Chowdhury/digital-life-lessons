import { Heart, Sparkles } from "lucide-react";

export default function LessonCard({ lesson }) {
  return (
    <div className="group bg-base-100 rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-base-300/50 flex flex-col h-full">
      <div className="relative h-52 w-full mb-4 overflow-hidden rounded-[1.5rem]">
        <img 
          src={lesson.image} 
          className="h-full w-full object-cover group-hover:scale-110 transition duration-700" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="badge badge-secondary font-bold border-none">{lesson.category}</span>
        </div>
      </div>

      <div className="flex-1 px-2">
        <h3 className="text-xl font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {lesson.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={lesson.authorImage || "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg"} />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold opacity-80">{lesson.authorName}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">{new Date(lesson.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="p-2 pt-4 border-t border-base-200 flex justify-between items-center">
        <div className="flex items-center gap-1 font-black text-secondary">
          <Heart size={16} fill="currentColor" /> {lesson.favoritesCount || 0}
        </div>
        {lesson.isFeatured && (
          <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full">
            <Sparkles size={14} /> Featured
          </div>
        )}
      </div>
    </div>
  );
}