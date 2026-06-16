interface Props {
  rating: number;
  max?: number;
}

export function StarRating({ rating, max = 4 }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={i < rating ? "text-amber-400" : "text-gray-200"}
          width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}
