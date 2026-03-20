export function StreamingIndicator() {
  return (
    <span
      role="status"
      aria-label="AI is responding"
      className="inline-flex items-center gap-1"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
