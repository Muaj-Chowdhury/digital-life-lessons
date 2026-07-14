export default function TopContributors({ data }) {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto ">
      <div>
        <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
          Top <span className="text-gradient">Contributors</span>
        </h2>
        <p className="text-base-content/60 font-medium mt-2">
          The voices shaping our collective wisdom.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow divide-y">
        {data.map((u, i) => (
          <div key={u._id} className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl">{["🥇", "🥈", "🥉"][i] || "🏅"}</span>
              <span className="font-medium">{u.name}</span>
            </div>

            <span className="text-indigo-600 font-semibold">
              {u.lessons} lessons
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
