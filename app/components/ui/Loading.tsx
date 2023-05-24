const dots = [1, 2, 3, 4];

export default function Loading() {
  return (
    <div className="h-6 flex flex-row gap-1 items-center">
      {dots.map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-current rounded animate-wave"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
