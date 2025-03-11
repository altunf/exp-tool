export function TimerDisplay({ timeRemaining }) {
  if (timeRemaining <= 0) return null;
  
  return (
    <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
      {(timeRemaining / 1000).toFixed(1)}s
    </div>
  );
}