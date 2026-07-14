import LessonCard from "./LessonCard";

export default function MostSaved({ lessons }) {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto ">
      <h2 className="text-4xl md:text-5xl font-black text-center pb-12 text-base-content tracking-tight">
  <span className="text-gradient">Most Saved</span> Lessons
</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {lessons?.map(l => (
          <LessonCard key={l._id} lesson={l} />
        ))}
      </div>
    </section>
  );
}
