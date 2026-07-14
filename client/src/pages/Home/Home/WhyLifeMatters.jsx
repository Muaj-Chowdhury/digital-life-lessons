import { Sparkles, Heart, Zap, TrendingUp } from "lucide-react";

const items = [
  {
    title: "Real Experiences",
    text: "Lessons from life, not theory",
    icon: Sparkles,
    color: "bg-blue-200 text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Emotional Growth",
    text: "Understand people better",
    icon: Heart,
    color: "bg-pink-200 text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    title: "Quick Wisdom",
    text: "Short but impactful lessons",
    icon: Zap,
    color: "bg-amber-200 text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    title: "Self Improvement",
    text: "Grow one lesson at a time",
    icon: TrendingUp,
    color: "bg-emerald-200 text-emerald-600",
    bgColor: "bg-emerald-100",
  },
];

export default function WhyLifeMatters() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto ">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-base-content">
          Why Learning From <span className="text-gradient">Life Matters</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
          The best education doesn't always happen in a classroom.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className={`group relative p-8  border ${item.bgColor} border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 `}
          >
            <div className={`inline-flex p-3 rounded-2xl mb-6 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3  transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
