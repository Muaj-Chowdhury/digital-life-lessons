import LessonCard from "./LessonCard";


export default function FeaturedLessons({ lessons }) {
  return (
    <section className="space-y-5">
      <h2 className="text-4xl md:text-5xl font-black text-center pt-20 pb-10 text-base-content tracking-tight">
  <span className="text-gradient">Featured</span> Lessons
</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {lessons?.map(l => (
          <LessonCard key={l._id} lesson={l} />
        ))}
      </div>
    </section>
  );
}
